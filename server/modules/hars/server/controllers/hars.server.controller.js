'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  http = require('http'),
  Har = mongoose.model('Har'),
  Spec = mongoose.model('Spec'),
  // h2s = require('har-to-swagger'), // Temporarily disabled due to dependency issues
  plantuml = require('node-plantuml'),
  url = require('url'),
  pumlEncoder = require('plantuml-encoder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Har
 */
exports.create = function (req, res) {
  var har = new Har(req.body);
  har.user = req.user;
  har.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(har);
    }
  });

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
exports.update = function (req, res) {
  var har = req.har;

  har = _.extend(har, req.body);

  har.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(har);
    }
  });
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
exports.delete = function (req, res) {
  var har = req.har;

  har.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(har);
    }
  });
};

/**
 * List of Hars
 */
exports.list = function (req, res) {
  Har.find().sort('-created').populate('user', 'displayName').exec(function (err, hars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(hars);
    }
  });
};

/**
 * Har middleware
 */
exports.harByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Har is invalid'
    });
  }

  Har.findById(id).populate('user', 'displayName').exec(function (err, har) {
    if (err) {
      return next(err);
    } else if (!har) {
      return res.status(404).send({
        message: 'No Har with that identifier has been found'
      });
    }
    req.har = har;
    next();
  });
};

exports.createSwagger = function (req, res) {
  // Temporarily disabled due to har-to-swagger dependency issues
  return res.status(501).send({
    message: 'Swagger generation temporarily disabled due to dependency issues'
  });
  
  /*
  var user = req.user,
    har = req.har,
    logObj = {
      log: har.log
    },
    harId = har._id;
  // console.log(JSON.stringify(logObj, null, 2));

  h2s.generateAsync(JSON.stringify(logObj), function (err, result) {
    if (err) {
      console.log('error: ' + err);
      return res.status(400).send({
        message: err
      });
    } else {
      var spec = new Spec();
      spec.user = req.user;
      spec.title = har.name;
      spec.swagger = result.swagger;
      spec.save(function (err) {
        if (err) {
          console.log('Error saving spec to MongoDB: ' + JSON.stringify(spec, null, 2));
          return res.status(400).send({
            message: err
          });
        } else {
          har.specs.push(spec._id);
          har.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(har);
            }
          });
        }
      });
    }
  });
  */
};

exports.readUML = function (req, res) {
  var har = req.har;
  // res.set('Content-Type', 'image/svg+xml');
  res.set('Content-Type', 'image/png');
  var decode = plantuml.decode(har.puml);
  // var gen = plantuml.generate({format: 'svg'});
  var gen = plantuml.generate({ format: 'png' });
  decode.out.pipe(gen.in);
  gen.out.pipe(res);
};

exports.createUML = function (req, res) {
  var har = req.har;
  var log = har.log;
  var pumlText = '';
  pumlfy(log, function (data) {
    pumlText = data;
    var encoded = pumlEncoder.encode(pumlText);
    har.puml = encoded;
    har.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(har);
      }
    });
  });
};

function pumlfy(log, callback) {
  var pumlText = '';
  for (var entry in log.entries) {
    if (log.entries.hasOwnProperty(entry)) {

      var requestUrlObj = url.parse(log.entries[entry].request.url);
      //var resourceGuess = requestUrlObj.pathname.split("/").pop();
      // Service name
      var serviceName = log.entries[entry]['x-service-name'] || requestUrlObj.pathname;
      var resourceName = log.entries[entry]['x-resource-name'] || requestUrlObj.pathname.split("/").pop();
      var method = log.entries[entry].request.method.toLowerCase();
      var resStatus = log.entries[entry].response.status;
      
      var resStatusText;
      switch (log.entries[entry].response.status) {
        case 200:
          resStatusText = '';
            break;
        default:
          resStatusText = ' ' + log.entries[entry].response.statusText;
            break;
      }

      // Query params
      var queryParams = '';
      for (var qParam in log.entries[entry].request.queryString) {
        queryParams += log.entries[entry].request.queryString[qParam].name + ', '
      }
      // Path params
      var pathParams = '';
      for (var pParam in log.entries[entry].request['x-path-params']) {
        pathParams += log.entries[entry].request['x-path-params'][pParam].name + ', '
      }

      var allParams = queryParams + pathParams;

      pumlText +=
        '"User Agent" -> ' + //request
        '"' + serviceName + '"' +
        ': ' + method + resourceName.charAt(0).toUpperCase() + resourceName.slice(1) +
        '(' +
        allParams.replace(/,\s*$/, '') +
        ') \n' +
        'note right: ' +
        requestUrlObj.pathname +
        '\n' + //response
        '"' + serviceName + '"' + //service
        ' -> "User Agent": ' + //client
        resStatus + //method (status?)
        '( ' +
        resourceName + resStatusText + //params (payload)
        ' ) \n';
    }
  }
  // Make sure the callback is a function​
  if (typeof callback === 'function') {
    // Call it, since we have confirmed it is callable​
    callback(pumlText);
  }
}

