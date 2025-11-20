'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  Har = mongoose.model('Har'),
  Spec = mongoose.model('Spec'),
  h2s = require('har-to-swagger'),
  url = require('url'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Har
 */
exports.create = async function (req, res) {
  try {
    // Ensure the log field is properly serialized (handles any edge cases)
    var harData = req.body;
    if (harData.log && typeof harData.log === 'object') {
      // Convert to JSON and back to ensure clean serialization
      harData.log = JSON.parse(JSON.stringify(harData.log));
    }
    var har = new Har(harData);
    har.user = req.user;
    await har.save();
    res.jsonp(har);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Show the current Har
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var har = req.har ? req.har.toJSON() : {};
  // Add a custom field to Har, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Har model.
  har.isCurrentUserOwner = req.user && har.user && har.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(har);
};

/**
 * Update a Har
 */
exports.update = async function (req, res) {
  try {
    var har = req.har;
    har = _.extend(har, req.body);
    await har.save();
    res.jsonp(har);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Patch a Har
 */
exports.patch = function (req, res) {
  var har = req.har;

  // har = _.extend(har, req.body);

  var patches = [
    { op: 'add', path: '/log/foo', value: 'bar' }
  ];

  har.patch(patches, function callback(err) {
    if (err) return next(err);
    // res.send(myCar);
    // console.log();
    // har.save(function (err) {
    //   if (err) {
    //     return res.status(400).send({
    //       message: errorHandler.getErrorMessage(err)
    //     });
    //   } else {
    //     res.jsonp(har);
    //   }
    // });
    res.jsonp(har);
  });


};

/**
 * Delete a Har
 */
exports.delete = async function (req, res) {
  try {
    var har = req.har;
    await har.deleteOne();
    res.jsonp(har);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * List of Hars
 */
exports.list = async function (req, res) {
  console.log('[HARs Controller] list() called');
  
  try {
    // Check if Har model is available
    if (!Har) {
      console.error('[HARs Controller] Har model is not available');
      return res.status(500).json({
        message: 'Database model not available',
        error: 'Har model not loaded'
      });
    }

    console.log('[HARs Controller] Starting Har.find() query');
    
    // Mongoose 8.x no longer supports callbacks - use async/await
    const hars = await Har.find().sort('-created').populate('user', 'displayName').exec();
    
    console.log('[HARs Controller] Found', hars ? hars.length : 0, 'HARs');
    // Return empty array if no HARs found, or the list of HARs
    res.jsonp(hars || []);
    console.log('[HARs Controller] Response sent successfully');
  } catch (err) {
    console.error('[HARs Controller] Error fetching HARs:', err);
    console.error('[HARs Controller] Error stack:', err.stack);
    return res.status(500).json({
      message: 'Error fetching HAR files',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Har middleware
 */
exports.harByID = async function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Har is invalid'
    });
  }

  try {
    const har = await Har.findById(id).populate('user', 'displayName').exec();
    if (!har) {
      return res.status(404).send({
        message: 'No Har with that identifier has been found'
      });
    }
    req.har = har;
    next();
  } catch (err) {
    return next(err);
  }
};

exports.createSwagger = async function (req, res) {
  try {
    var user = req.user,
      har = req.har,
      harId = har._id;
    
    // Validate that har.log exists and has entries
    if (!har.log) {
      return res.status(400).send({
        message: 'HAR file does not contain a log property'
      });
    }
    
    if (!har.log.entries || !Array.isArray(har.log.entries) || har.log.entries.length === 0) {
      return res.status(400).send({
        message: 'HAR file does not contain any entries in the log'
      });
    }
    
    // Convert Mongoose document to plain JavaScript object
    // This ensures proper serialization and handles any MongoDB-specific types
    var harObj = har.toObject ? har.toObject() : har;
    var cleanLog = harObj.log;
    
    // Create the HAR structure expected by har-to-swagger
    var logObj = {
      log: cleanLog
    };
    
    // Convert to JSON string and validate
    var harContent = JSON.stringify(logObj);
    if (!harContent || harContent === '{}' || harContent === '{"log":null}' || harContent === '{"log":{}}') {
      console.error('Invalid HAR content:', {
        harId: harId,
        harName: har.name,
        hasLog: !!har.log,
        logType: typeof har.log,
        logKeys: har.log ? Object.keys(har.log) : null,
        stringifiedLength: harContent ? harContent.length : 0
      });
      return res.status(400).send({
        message: 'Invalid HAR file structure: log data is empty or malformed'
      });
    }
    
    console.log('Generating Swagger spec for HAR:', har.name, 'with', har.log.entries.length, 'entries');
    console.log('HAR content length:', harContent.length, 'characters');
    
    // Promisify the callback-based generateAsync function
    const result = await new Promise((resolve, reject) => {
      h2s.generateAsync(harContent, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Create and save the spec
    var spec = new Spec();
    spec.user = req.user;
    spec.title = har.name;
    spec.swagger = result.swagger;
    await spec.save();

    // Add spec to har and save
    har.specs.push(spec._id);
    await har.save();

    res.jsonp(har);
  } catch (err) {
    var har = req.har;
    var harId = har ? har._id : 'unknown';
    console.error('Error generating Swagger spec:', err);
    console.error('Error stack:', err.stack);
    console.error('HAR details:', {
      harId: harId,
      harName: har ? har.name : 'unknown',
      hasLog: har ? !!har.log : false,
      logEntriesCount: har && har.log && har.log.entries ? har.log.entries.length : 0,
      errorMessage: err.message
    });
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

exports.readUML = function (req, res) {
  var har = req.har;
  // Return Mermaid text for client-side rendering
  res.set('Content-Type', 'text/plain');
  // Support both mermaid (new) and puml (legacy) for backward compatibility
  var mermaidText = har.mermaid || '';
  if (!mermaidText && har.puml) {
    // If only old PlantUML exists, return empty (user needs to regenerate)
    mermaidText = '';
  }
  res.send(mermaidText);
};

exports.createUML = async function (req, res) {
  try {
    var har = req.har;
    var log = har.log;
    
    // Generate Mermaid text synchronously (it's a simple string builder)
    var mermaidText = '';
    mermaidify(log, function (text) {
      mermaidText = text;
    });
    
    har.mermaid = mermaidText;
    // Keep puml field for backward compatibility during migration
    // har.puml = null; // Can be removed later
    await har.save();
    res.jsonp(har);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

function mermaidify(log, callback) {
  var mermaidText = 'sequenceDiagram\n';
  mermaidText += '    participant UA as "User Agent"\n';
  
  // Collect unique services first
  var services = [];
  var serviceMap = {};
  var serviceIndex = 0;
  
  for (var entry in log.entries) {
    if (log.entries.hasOwnProperty(entry)) {
      var requestUrlObj = url.parse(log.entries[entry].request.url);
      var serviceName = log.entries[entry]['x-service-name'] || 
                       requestUrlObj.hostname || 
                       requestUrlObj.pathname || 
                       'Service';
      
      // Normalize service name
      serviceName = serviceName.replace(/^\/+|\/+$/g, ''); // Remove leading/trailing slashes
      if (!serviceName) serviceName = 'Service';
      
      if (!serviceMap[serviceName]) {
        serviceMap[serviceName] = 'S' + serviceIndex;
        services.push({ name: serviceName, id: 'S' + serviceIndex });
        mermaidText += '    participant S' + serviceIndex + ' as "' + serviceName + '"\n';
        serviceIndex++;
      }
    }
  }
  
  mermaidText += '\n';
  
  // Generate sequence
  for (var entry in log.entries) {
    if (log.entries.hasOwnProperty(entry)) {
      var requestUrlObj = url.parse(log.entries[entry].request.url);
      var serviceName = log.entries[entry]['x-service-name'] || 
                       requestUrlObj.hostname || 
                       requestUrlObj.pathname || 
                       'Service';
      
      // Normalize service name
      serviceName = serviceName.replace(/^\/+|\/+$/g, '');
      if (!serviceName) serviceName = 'Service';
      
      var serviceId = serviceMap[serviceName] || 'S0';
      var resourceName = log.entries[entry]['x-resource-name'] || 
                        requestUrlObj.pathname.split("/").pop() || 
                        'resource';
      var method = log.entries[entry].request.method.toLowerCase();
      var resStatus = log.entries[entry].response.status;
      
      var resStatusText;
      switch (log.entries[entry].response.status) {
        case 200:
          resStatusText = '';
          break;
        default:
          resStatusText = ' ' + (log.entries[entry].response.statusText || '');
          break;
      }

      // Query params
      var queryParams = '';
      if (log.entries[entry].request.queryString) {
        for (var qParam in log.entries[entry].request.queryString) {
          if (log.entries[entry].request.queryString.hasOwnProperty(qParam)) {
            queryParams += log.entries[entry].request.queryString[qParam].name + ', ';
          }
        }
      }
      
      // Path params
      var pathParams = '';
      if (log.entries[entry].request['x-path-params']) {
        for (var pParam in log.entries[entry].request['x-path-params']) {
          if (log.entries[entry].request['x-path-params'].hasOwnProperty(pParam)) {
            pathParams += log.entries[entry].request['x-path-params'][pParam].name + ', ';
          }
        }
      }

      var allParams = (queryParams + pathParams).replace(/,\s*$/, '');
      var methodName = method + resourceName.charAt(0).toUpperCase() + resourceName.slice(1);
      var paramsStr = allParams ? '(' + allParams + ')' : '()';
      
      // Request message
      mermaidText += '    UA->>' + serviceId + ': ' + methodName + paramsStr + '\n';
      
      // Note
      if (requestUrlObj.pathname) {
        mermaidText += '    Note right of ' + serviceId + ': ' + requestUrlObj.pathname + '\n';
      }
      
      // Response message
      mermaidText += '    ' + serviceId + '-->>UA: ' + resStatus + '(' + resourceName + resStatusText + ')\n';
    }
  }
  
  // Make sure the callback is a function
  if (typeof callback === 'function') {
    callback(mermaidText);
  }
}

