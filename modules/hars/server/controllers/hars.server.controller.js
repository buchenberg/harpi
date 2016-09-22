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
  plantuml = require('node-plantuml'),
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

exports.createSwagger = function (req, res) {
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
      var serviceName = log.entries[entry]['x-name'];
      var method = log.entries[entry].request.method.toLowerCase();
      var queryParams = '';
      for (var item in log.entries[entry].request.queryString) {
        queryParams += log.entries[entry].request.queryString[item].name + ', '
      }
      var pathParams = '';
      for (var item in log.entries[entry].request['x-path-params']) {
        pathParams += log.entries[entry].request['x-path-params'][item].name + ', '
      }
      var allParams = queryParams + pathParams;

      pumlText +=
              '"User Agent" -> ' +
              '"' + serviceName + '"' +
              ': ' + method + '-' + log.entries[entry].request['x-description'] +
              '(' +
               allParams.replace(/,\s*$/, '') +
              ') \n' +
              'note right: ' +
              log.entries[entry].request.url +
               '\n' +
              '"' + serviceName + '"' +
              ' -> "User Agent": ' +
              log.entries[entry].response.status +
              '(' +
              log.entries[entry].response['x-description'] +
              ') \n';

    //   switch (method) {
    //     case 'get':
    //       pumlText +=
    //           '"User Agent" -> ' +
    //           '"' + serviceName + '"' +
    //           ': ' + method + '-' + log.entries[entry].request['x-description'] +
    //           '(' +
    //            allParams.replace(/,\s*$/, '') +
    //           ') \n' +
    //           'note right: ' +
    //           log.entries[entry].request.url +
    //            '\n' +
    //           '"' + serviceName + '"' +
    //           ' -> "User Agent": ' +
    //           log.entries[entry].response.status +
    //           '(' +
    //           log.entries[entry].response['x-description'] +
    //           ') \n';
    //       break;
    //     default:
    //       pumlText +=
    //           '"User Agent" -> ' +
    //           '"' + serviceName + '"' +
    //           ': ' + method + '-' + log.entries[entry].request['x-description'] +
    //           '(' +
    //           //log.entries[entry].request['x-description'] + //TODO params here
    //           ') \n' +
    //           'note right: ' +
    //           log.entries[entry].request.url +
    //            '\n' +
    //           '"' + serviceName + '"' +
    //           ' -> "User Agent": ' +
    //           log.entries[entry].response.status +
    //           '(' +
    //           log.entries[entry].response['x-description'] +
    //           ') \n';
    //       break;
    //   }
    }
  }
    // Make sure the callback is a function​
  if (typeof callback === 'function') {
        // Call it, since we have confirmed it is callable​
    callback(pumlText);
  }
}

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
 * Delete an Har
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