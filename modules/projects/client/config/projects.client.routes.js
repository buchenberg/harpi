'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/create-project.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/view-project.client.view.html'
      })
      .state('projects.edit', {
        url: '/:projectId/edit',
        templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
