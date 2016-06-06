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

//the ugly ass functionality is right here.
//jolt is the tranformer
//TODO manage dependency better
//spec is the transform specification
//TODO CRUD to MongoDB as part of custom pipeline
//inputUrl is the endpoint address of the resource to be pransformed
//TODO prolly shouldn't hard-code this

function cool() {
  var jolt = 'C:\\Users\\Greg\\APPS\\jolt-cli-0.0.22-SNAPSHOT-shaded.jar';
  var spec = 'C:\\Users\\Greg\\Documents\\GitHub\\harpi\\modules\\hars\\server\\controllers\\spec.json';
  var inputUrl = 'http://localhost:3000/api/hars/5754a9642c94b6dc1b2669b9';
  var exec = require('child_process').exec,
    child;
  child = exec('curl -s ' +
    inputUrl +
    ' | java -jar ' +
    jolt +
    ' transform ' +
    spec,
    function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}
/**
 * Show the current Har
 */
exports.read = function(req, res) {
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
  cool();
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