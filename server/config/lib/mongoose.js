'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  chalk = require('chalk'),
  path = require('path'),
  mongoose = require('mongoose');

// Load the mongoose models
module.exports.loadModels = function (callback) {
  // Globbing model files
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

// Initialize Mongoose
module.exports.connect = async function (cb) {
  try {
    var db = await mongoose.connect(config.db.uri, config.db.options);
    
    // Enabling mongoose debug mode if required
    mongoose.set('debug', config.db.debug);
    
    console.log(chalk.green('Successfully connected to MongoDB!'));
    
    // Call callback FN
    if (cb) cb(db);
    
    return db;
  } catch (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(err);
    throw err;
  }
};

module.exports.disconnect = async function (cb) {
  try {
    await mongoose.disconnect();
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    if (cb) cb(null);
  } catch (err) {
    console.error(chalk.red('Error disconnecting from MongoDB!'));
    if (cb) cb(err);
  }
};
