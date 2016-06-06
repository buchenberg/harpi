'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Har = mongoose.model('Har'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Har
 */
exports.create = function(req, res) {
  var har = new Har(req.body);
  har.user = req.user;

  har.save(function(err) {
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
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var har = req.har ? req.har.toJSON() : {};
  var jolt = 'C:\\Users\\Greg\\APPS\\jolt-cli-0.0.22-SNAPSHOT-shaded.jar';
  var spec = 'C:\\Users\\Greg\\Documents\\GitHub\\harpi\\modules\\hars\\server\\controllers\\spec.json';
  var input = 'C:\\Users\\Greg\\Documents\\GitHub\\harpi\\modules\\projects\\client\\uploads\\projects\\57510af1f695f2801a399cf7\\har\\5092278d1379842f9462ba1e0a9fb847';
  var exec = require('child_process').exec,
    child;
  child = exec('java -jar '+jolt+' transform '+spec+' '+input,
    function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  // Add a custom field to Har, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Har model.
  har.isCurrentUserOwner = req.user && har.user && har.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(har);
};

/**
 * Update a Har
 */
exports.update = function(req, res) {
  var har = req.har;

  har = _.extend(har, req.body);

  har.save(function(err) {
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
exports.delete = function(req, res) {
  var har = req.har;

  har.remove(function(err) {
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
exports.list = function(req, res) {
  Har.find().sort('-created').populate('user', 'displayName').exec(function(err, hars) {
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
exports.harByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Har is invalid'
    });
  }

  Har.findById(id).populate('user', 'displayName').exec(function(err, har) {
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