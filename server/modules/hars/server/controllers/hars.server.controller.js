'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  Har = mongoose.model('Har'),
  Spec = mongoose.model('Spec'),
  Diagram = mongoose.model('Diagram'),
  Project = mongoose.model('Project'),
  h2s = require('har-to-swagger'),
  h2m = require('har-to-mermaid'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Har
 */
exports.create = async function (req, res) {
  try {
    // Validate project is provided
    if (!req.body.project) {
      return res.status(400).send({
        message: 'Project is required'
      });
    }

    // Ensure the log field is properly serialized (handles any edge cases)
    var harData = req.body;
    if (harData.log && typeof harData.log === 'object') {
      // Convert to JSON and back to ensure clean serialization
      harData.log = JSON.parse(JSON.stringify(harData.log));
    }
    var har = new Har(harData);
    har.user = req.user;
    await har.save();

    // Add HAR to project's hars array
    var project = await Project.findById(req.body.project).exec();
    if (project) {
      if (!project.hars) {
        project.hars = [];
      }
      if (project.hars.indexOf(har._id) === -1) {
        project.hars.push(har._id);
        await project.save();
      }
    }

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
    const hars = await Har.find().sort('-created')
      .populate('user', 'displayName')
      .populate('project', 'title')
      .exec();
    
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
    spec.har = har._id;
    spec.project = har.project;
    await spec.save();

    // Add spec to har and save
    if (!har.specs) {
      har.specs = [];
    }
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
  res.send(har.mermaid || '');
};

exports.createUML = async function (req, res) {
  try {
    var har = req.har;
    
    // Validate that har.log exists
    if (!har.log || !har.log.entries || !Array.isArray(har.log.entries)) {
      return res.status(400).send({
        message: 'HAR file does not contain a valid log with entries'
      });
    }
    
    // Convert Mongoose document to plain JavaScript object
    var harObj = har.toObject ? har.toObject() : har;
    var log = harObj.log;
    
    // Generate Mermaid text using the library
    var mermaidText = h2m.generate(log);
    
    // Save to HAR document (for backward compatibility)
    har.mermaid = mermaidText;
    await har.save();
    
    // Also create a Diagram document in the collection
    var diagram = new Diagram({
      title: har.name || 'HAR Diagram',
      description: 'Generated from HAR file: ' + (har.name || 'Untitled'),
      mermaid: mermaidText,
      har: har._id,
      project: har.project,
      user: req.user
    });
    await diagram.save();

    // Add diagram to har's diagrams array
    if (!har.diagrams) {
      har.diagrams = [];
    }
    har.diagrams.push(diagram._id);
    await har.save();
    
    res.jsonp({
      har: har,
      diagram: diagram
    });
  } catch (err) {
    console.error('Error generating Mermaid diagram:', err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Create a diagram from HAR (saves to diagrams collection)
 */
exports.createDiagram = async function (req, res) {
  try {
    var har = req.har;
    
    // Validate that har.log exists
    if (!har.log || !har.log.entries || !Array.isArray(har.log.entries)) {
      return res.status(400).send({
        message: 'HAR file does not contain a valid log with entries'
      });
    }
    
    // Convert Mongoose document to plain JavaScript object
    var harObj = har.toObject ? har.toObject() : har;
    var log = harObj.log;
    
    // Generate Mermaid text using the library
    var mermaidText = h2m.generate(log);
    
    // Create a Diagram document in the collection
    var diagram = new Diagram({
      title: har.name || 'HAR Diagram',
      description: 'Generated from HAR file: ' + (har.name || 'Untitled'),
      mermaid: mermaidText,
      har: har._id,
      project: har.project,
      user: req.user
    });
    await diagram.save();

    // Add diagram to har's diagrams array
    if (!har.diagrams) {
      har.diagrams = [];
    }
    har.diagrams.push(diagram._id);
    await har.save();
    
    res.jsonp(diagram);
  } catch (err) {
    console.error('Error creating diagram:', err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

