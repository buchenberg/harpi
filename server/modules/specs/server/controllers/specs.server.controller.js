'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Spec = mongoose.model('Spec'),
    // h2s = require('har-to-swagger'), // Temporarily disabled due to dependency issues
    Dredd = require('dredd'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Swagger definition from har input
 * required:
 * body.title
 * body.log
 */
exports.create = async function(req, res) {
    try {
        var spec = new Spec(req.body);
        spec.user = req.user;
        await spec.save();
        res.json(spec);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * Show the current Spec
 */
exports.read = function(req, res) {
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
exports.readSwagger = function(req, res) {
    // convert mongoose document to JSON
    var spec = req.spec ? req.spec.toJSON() : {};
    res.json(spec.swagger);
};

/**
 * Test the current Spec using dredd
 */
exports.testSwagger = function(req, res) {
    var swaggerPath = 'http://localhost:3000/api/specs/' + req.spec._id + '/swagger';
    var outFile = './modules/specs/client/views/' + req.spec._id + '-result.html';
    var configuration = {
        server: 'http://localhost:3000', // your URL to API endpoint the tests will run against
        options: {
            'path': [swaggerPath],
            'reporter': ['html'], // Array of possible reporters, see folder src/reporters
            'silent': true,
            'inline-errors': true,
            'details': true,
            'output': [outFile]
        }
    };
    var dredd = new Dredd(configuration);
    dredd.run(function(err, stats) {
        if (err) {
            console.log(err);
            console.log(stats);
            res.status(400).send({
                error: errorHandler.getErrorMessageNew(err)
            });
        } else {
            res.jsonp(stats);
        }
    });
};

/**
 * Update a Spec
 */
exports.update = async function(req, res) {
    try {
        var spec = req.spec;
        spec = _.extend(spec, req.body);
        await spec.save();
        res.jsonp(spec);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessageNew(err)
        });
    }
};

/**
 * Delete an Spec
 */
exports.delete = async function(req, res) {
    try {
        var spec = req.spec;
        await spec.deleteOne();
        res.jsonp(spec);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * List of Specs
 */
exports.list = async function(req, res) {
    try {
        const specs = await Spec.find().sort('-created').populate('user', 'displayName').exec();
        res.jsonp(specs);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * Spec middleware
 */
exports.specByID = async function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Spec is invalid'
        });
    }

    try {
        const spec = await Spec.findById(id).populate('user', 'displayName').exec();
        if (!spec) {
            return res.status(404).send({
                message: 'No Spec with that identifier has been found'
            });
        }
        req.spec = spec;
        next();
    } catch (err) {
        return next(err);
    }
};