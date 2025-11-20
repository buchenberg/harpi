'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk'),
  seed = require('./seed');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning:  Database seeding is turned on'));
    seed.start();
  }
}

// Initialize Models
mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = async function init(callback) {
  try {
    var db = await mongoose.connect();
    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);
  } catch (err) {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  }
};

module.exports.start = async function start(callback) {
  var _this = this;

  try {
    await _this.init(function (app, db, config) {
      // Start the app by listening on <port>
      var server = app.listen(config.port, function () {
        // Get the actual address the server is listening on
        var address = server.address();
        var protocol = process.env.NODE_ENV === 'secure' ? 'https' : 'http';
        var host = address.address === '0.0.0.0' || address.address === '::' ? 'localhost' : address.address;
        var serverUrl = protocol + '://' + host + ':' + address.port;
        
        // Logging initialization
        console.log('--');
        console.log(chalk.green(config.app.title));
        console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
        console.log(chalk.green('Server URL:\t\t\t' + chalk.bold.cyan(serverUrl)));
        console.log(chalk.green('Address:\t\t\t' + address.address));
        console.log(chalk.green('Port:\t\t\t\t' + address.port));
        console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
        if (process.env.NODE_ENV === 'secure') {
          console.log(chalk.green('HTTPs:\t\t\t\ton'));
        }
        console.log(chalk.green('App version:\t\t\t' + config.meanjs.version));
        if (config.meanjs['meanjs-version'])
          console.log(chalk.green('MEAN.JS version:\t\t\t' + config.meanjs['meanjs-version']));
        console.log('--');
        console.log(chalk.bold.green('✓ Server is running and ready to accept connections'));
        console.log(chalk.gray('  Access the API at: ' + chalk.cyan(serverUrl + '/api')));
        console.log(chalk.gray('  View Swagger docs at: ' + chalk.cyan(serverUrl + '/swagger')));
        console.log('--');

        // Pass server, db, and config to the callback
        if (callback) callback(server, db, config);
      });
    });
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
};
