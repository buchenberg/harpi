'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // In development, don't handle frontend routes - let Vite handle them
  // In production, serve the built React app
  if (process.env.NODE_ENV === 'production') {
    app.route('/*').get(core.renderIndex);
  }
};
