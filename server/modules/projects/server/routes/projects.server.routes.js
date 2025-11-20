'use strict';

/**
 * Module dependencies.
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function (app) {
  // Projects collection routes
  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projects.create);

  // Single project routes
  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

    //List HAR files in project. Also supports reportType param for aggregate queries.
  app.route('/api/projects/:projectId/hars').all(projectsPolicy.isAllowed)
    .get(projects.listHars)
    .post(projects.uploadHar);

  // Finish by binding the project middleware
  app.param('projectId', projects.projectByID);
};
