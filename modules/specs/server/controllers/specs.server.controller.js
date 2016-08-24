'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Spec = mongoose.model('Spec'),
  h2s = require('har-to-swagger'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Swagger definition from har input
 * required:
 * body.title
 * body.log
 */
exports.create = function (req, res) {

  h2s.generateAsync(JSON.stringify(req.body), function (err, result) {
    if (err) {
      console.log('error: ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log('result: ' + JSON.stringify(result, null, 2));
      var spec = new Spec();
      spec.user = req.user;
      spec.title = req.body.title;
      spec.swagger = result.swagger;
      console.log('spec: ' + JSON.stringify(spec, null, 2));
      spec.save(function (err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(spec.swagger);
        }
      });
    }
  });


};

/**
 * Show the current Spec
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var spec = req.spec ? req.spec.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  spec.isCurrentUserOwner = req.user && spec.user && spec.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(spec);
};

/**
 * Show the current Spec
 */
exports.readSwagger = function (req, res) {
  // convert mongoose document to JSON
  var spec = req.spec ? req.spec.toJSON() : {};
  res.jsonp(spec.swagger);
};

/**
 * Update a Spec
 */
exports.update = function (req, res) {
  var spec = req.spec;

  spec = _.extend(spec, req.body);

  spec.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spec);
    }
  });
};

/**
 * Delete an Spec
 */
exports.delete = function (req, res) {
  var spec = req.spec;

  spec.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(spec);
    }
  });
};

/**
 * List of Specs
 */
exports.list = function (req, res) {
  Spec.find().sort('-created').populate('user', 'displayName').exec(function (err, specs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(specs);
    }
  });
};

/**
 * Spec middleware
 */
exports.specByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Spec is invalid'
    });
  }

  Spec.findById(id).populate('user', 'displayName').exec(function (err, spec) {
    if (err) {
      return next(err);
    } else if (!spec) {
      return res.status(404).send({
        message: 'No Spec with that identifier has been found'
      });
    }
    req.spec = spec;
    next();
  });
};
