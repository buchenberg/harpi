'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a project
 */
exports.create = function (req, res) {
  var project = new Project(req.body);
  project.user = req.user;

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * Update har
 */
exports.uploadHar = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.projectUpload).single('newHar');
  var harUploadFileFilter = require(path.resolve('./config/lib/multer')).harUploadFileFilter;
  
  // Filtering to upload only JSON
  upload.fileFilter = harUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading har'
        });
      } else {
        //do some shit with the har
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Show the current project
 */
exports.read = function (req, res) {
  res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function (req, res) {
  var project = req.project;

  project.title = req.body.title;
  project.description = req.body.description;

  project.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * Delete an project
 */
exports.delete = function (req, res) {
  var project = req.project;

  project.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(project);
    }
  });
};

/**
 * List of Projects
 */
exports.list = function (req, res) {
  Project.find().sort('-created').populate('user', 'displayName').exec(function (err, projects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(projects);
    }
  });
};

/**
 * Project middleware
 */
exports.projectByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  Project.findById(id).populate('user', 'displayName').exec(function (err, project) {
    if (err) {
      return next(err);
    } else if (!project) {
      return res.status(404).send({
        message: 'No project with that identifier has been found'
      });
    }
    req.project = project;
    next();
  });
};
