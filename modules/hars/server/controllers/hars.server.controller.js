'use strict';

/**
 * Module dependencies.
 */
var ZorbaAPI = require('zorba-nodejs').ZorbaAPI;
var path = require('path'),
    mongoose = require('mongoose'),
    http = require('http'),
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
//zorba is the tranformer
//TODO manage dependency better
//query is the transform specification
//TODO CRUD to MongoDB as part of custom pipeline
//inputUrl is the endpoint address of the resource to be transformed
//TODO prolly shouldn't hard-code this

function cool() {

    //TODO add to config
    var zorba = '/home/greg/Bin/zorba/bin/zorba';
    //http request for specs
    //TODO this is fucked. We should be able to get this via internal calls to the spec ObjectId
    //TODO this should use the current har as an external variable. Fuck yeah!!
    var options = {
        host: 'localhost',
        port: '3000',
        path: '/api/specs/575c7184b41cc0080a544e7e'
    };
    var callback = function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here. test
        response.on('end', function() {
            var query = JSON.stringify(JSON.parse(str).spec);
            var exec = require('child_process').exec,
                child;
            child = exec(zorba +
                " -f -q " +
                query,
                function(error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        });
    }

    http.request(options, callback).end();


}
/**
 * Show the current Har
 */
exports.read = function(req, res) {
    cool();
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
