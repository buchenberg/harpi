'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
  function ($resource) {
    return $resource('api/projects/:projectId', {
      projectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]).factory('ProjectHars', ['$resource',
  function ($resource) {
    console.log('project har request');
    return $resource('api/projects/:projectId/hars', {
      projectId: '@_id'
    }, {
      urlReport: {
        method: 'GET',
        isArray: true,
        params: {
          reportType: 'url'
        }
      }
    });
  }
]);
