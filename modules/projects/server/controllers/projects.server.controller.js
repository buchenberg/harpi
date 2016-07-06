'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Project = mongoose.model('Project'),
  Har = mongoose.model('Har'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a project
 */
exports.create = function(req, res) {
  var project = new Project(req.body);
  project.user = req.user;

  project.save(function(err) {
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
 * Show the current project
 */
exports.read = function(req, res) {
  res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
  var project = req.project;

  project.title = req.body.title;
  project.description = req.body.description;

  project.save(function(err) {
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
exports.delete = function(req, res) {
  var project = req.project;

  project.remove(function(err) {
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
exports.list = function(req, res) {
  Project.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
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
 * Update har
 */
exports.uploadHar = function(req, res) {
  var user = req.user,
    project = req.project,
    projectId = project._id,
    message = null,
    storage = multer.memoryStorage(),
    upload = multer({ storage: storage }).single('file');

  if (user) {
    console.log(user.displayName + ' is uploading a har file to the ' + req.project.title + ' project.');
    console.log("Uploading har to memory");
    upload(req, res, function(err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          //STUB
          message: 'Something happened at the upload stage.'
        });
      } else {
        //STUB
        console.log('File original name: %s', req.file.originalname);
        var harJson = JSON.parse(req.file.buffer);
        //console.log('harJson: %s', harJson);

        var newHar = new Har(harJson);
        newHar.name = req.file.originalname;

        newHar.save(function(err) {
          if (err) {
            console.log('Har error:' + err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('Har saved.');
          }
        });
        console.log('New har id: %s', JSON.stringify(newHar._id));

        project.hars.push({'name': 'foo', 'har': newHar._id});
        project.save(function(err) {
          if (err) {
            console.log('Error adding har to project.'+ err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            console.log('Har added to project.');
          }
        });
        Project.findOne({
            _id: projectId
          })
          .populate('hars')
          .exec(function(err, har) {
            if (err) return handleError(err);
          });
         return res.json(project);
      }
    });
  } else {
    res.status(400).send({
      message: 'Unauthorized.'
    });
  }
};



/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
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