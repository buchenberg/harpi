'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Diagram = mongoose.model('Diagram'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Diagram
 */
exports.create = async function(req, res) {
    try {
        var diagram = new Diagram(req.body);
        diagram.user = req.user;
        await diagram.save();
        res.json(diagram);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * Show the current Diagram
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var diagram = req.diagram ? req.diagram.toJSON() : {};

    // Add a custom field to determine if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database
    diagram.isCurrentUserOwner = req.user && diagram.user && diagram.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(diagram);
};

/**
 * Get the Mermaid diagram text
 */
exports.readMermaid = function(req, res) {
    // convert mongoose document to JSON
    var diagram = req.diagram ? req.diagram.toJSON() : {};
    res.set('Content-Type', 'text/plain');
    res.send(diagram.mermaid || '');
};

/**
 * Update a Diagram
 */
exports.update = async function(req, res) {
    try {
        var diagram = req.diagram;
        diagram = _.extend(diagram, req.body);
        await diagram.save();
        res.jsonp(diagram);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * Delete a Diagram
 */
exports.delete = async function(req, res) {
    try {
        var diagram = req.diagram;
        await diagram.deleteOne();
        res.jsonp(diagram);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * List of Diagrams
 */
exports.list = async function(req, res) {
    try {
        const diagrams = await Diagram.find().sort('-created').populate('user', 'displayName').exec();
        res.jsonp(diagrams);
    } catch (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * Diagram middleware
 */
exports.diagramByID = async function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Diagram is invalid'
        });
    }

    try {
        const diagram = await Diagram.findById(id).populate('user', 'displayName').exec();
        if (!diagram) {
            return res.status(404).send({
                message: 'No Diagram with that identifier has been found'
            });
        }
        req.diagram = diagram;
        next();
    } catch (err) {
        return next(err);
    }
};

