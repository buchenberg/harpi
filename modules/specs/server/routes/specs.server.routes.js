'use strict';

/**
 * Module dependencies
 */
var specsPolicy = require('../policies/specs.server.policy'),
  specs = require('../controllers/specs.server.controller');

module.exports = function (app) {
  // Specs Routes
  app.route('/api/specs').all(specsPolicy.isAllowed)
    .get(specs.list)
    .post(specs.create);

  app.route('/api/specs/:specId').all(specsPolicy.isAllowed)
    .get(specs.read)
    .put(specs.update)
    .delete(specs.delete);

  app.route('/api/specs/:specId/swagger').get(specs.readSwagger);

  app.route('/api/specs/:specId/dredd').post(specs.testSwagger);

  // Finish by binding the Spec middleware
  app.param('specId', specs.specByID);
};
