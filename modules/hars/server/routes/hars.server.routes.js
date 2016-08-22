'use strict';

/**
 * Module dependencies
 */
var harsPolicy = require('../policies/hars.server.policy'),
  hars = require('../controllers/hars.server.controller');

module.exports = function(app) {
  // Hars Routes
  app.route('/api/hars').all(harsPolicy.isAllowed)
    .get(hars.list)
    .post(hars.create);

  app.route('/api/hars/:harId').all(harsPolicy.isAllowed)
    .get(hars.read)
    .put(hars.update)
    .delete(hars.delete);
    //.post(hars.swaggerfy);

  //List HAR files in project. Also supports reportType param for aggregate queries.
  app.route('/api/hars/:harId/specs').all(harsPolicy.isAllowed)
    .post(hars.createSwagger);

  // Finish by binding the Har middleware
  app.param('harId', hars.harByID);
};
