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
exports.create = async function (req, res) {
  try {
    var project = new Project(req.body);
    project.user = req.user;
    await project.save();
    res.json(project);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
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
exports.update = async function (req, res) {
  try {
    var project = req.project;
    project.title = req.body.title;
    project.description = req.body.description;
    await project.save();
    res.json(project);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Delete an project
 */
exports.delete = async function (req, res) {
  try {
    var project = req.project;
    await project.deleteOne();
    res.json(project);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * List of Projects
 */
exports.list = async function (req, res) {
  try {
    const projects = await Project.find().sort('-created')
      .populate({
        path: 'hars.name',
        model: 'Har'
      }).exec();
    res.json(projects);
  } catch (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * List of Har files in Project
 * TODO modularize the aggregate reports to seperate functions
 */
exports.listHars = async function (req, res) {
  var project = req.project;
  if (Object.keys(req.query).length === 0) {
    try {
      const result = await Project.aggregate([
        {
          $unwind: '$hars'
        },
        {
          $lookup:
          {
            from: 'hars',
            localField: 'hars',
            foreignField: '_id',
            as: 'har'
          }
        },
        {
          $unwind: '$har'
        },
        {
          $group: {
            _id: '$har._id',
            user: { $first: '$har.user' },
            log: { $first: '$har.log' }
          }
        }
      ]).exec();
      res.json(result);
    } catch (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  } else {
    var reportType = req.query.reportType;
    switch (reportType) {
      case 'url':
        try {
          const result = await Project.aggregate([
            {
              $unwind: '$hars'
            },
            {
              $lookup:
              {
                from: 'hars',
                localField: 'hars',
                foreignField: '_id',
                as: 'har'
              }
            },
            {
              $unwind: '$har'
            },
            {
              $group: {
                _id: '$har._id',
                user: { $first: '$har.user' },
                log: { $first: '$har.log' }
              }
            },
            { $unwind: '$log.entries' },
            {
              $project: {
                verb: '$log.entries.request.method',
                path: '$log.entries.request.url'

              }
            },
            {
              $group: {
                '_id': '$path',
                'verb': { $first: '$verb' }
              }
            },
            {
              $sort: {
                '_id': 1
              }
            },
            {
              $group: {
                '_id': null,
                'requests': {
                  '$push': {
                    'path': '$_id',
                    'verb': '$verb'
                  }
                }
              }
            },
            {
              '$project': {
                '_id': 0,
                'requests.path': 1,
                'requests.verb': 1
              }
            }
          ]).exec();
          res.json(result);
        } catch (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        break;
      default:
        res.json({ 'result': 'unrecognized report type' });
    }
  }
};



/**
 * Update har
 */
exports.uploadHar = async function (req, res) {
  var user = req.user,
    project = req.project,
    projectId = project._id,
    message = null,
    storage = multer.memoryStorage(),
    upload = multer({ storage: storage }).single('file');

  if (user) {
    console.log(user.displayName + ' is uploading a har file to the ' + req.project.title + ' project.');
    console.log('Uploading har to memory');
    //console.log(user.displayName + ' is adding a har file to the ' + req.project.title + ' project.');
    upload(req, res, async function (err) {
      if (err) {
        console.log(err);
        return res.status(400).send({
          message: 'An error has occured'
        });
      } else {
        try {
          var harJson = JSON.parse(req.file.buffer),
            newHar = new Har(harJson);
          newHar.name = req.file.originalname;
          newHar.user = user;
          await newHar.save();
          console.log('Har saved.');
          project.hars.push(newHar._id);
          await project.save();
          console.log('Har added to project.');
          return res.json(project);
        } catch (saveErr) {
          console.error('Error saving HAR:', saveErr);
          return res.status(400).send({
            message: 'An error has occured saving the har file.'
          });
        }
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
exports.projectByID = async function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  try {
    const project = await Project.findById(id)
      .populate('user', 'displayName')
      .populate('hars', 'name')
      .exec();
    if (!project) {
      return res.status(404).send({
        message: 'No project with that identifier has been found'
      });
    }
    req.project = project;
    next();
  } catch (err) {
    return next(err);
  }
};