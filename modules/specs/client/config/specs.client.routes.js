(function () {
  'use strict';

  angular
    .module('specs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('specs', {
        abstract: true,
        url: '/specs',
        template: '<ui-view/>'
      })
      .state('specs.list', {
        url: '',
        templateUrl: 'modules/specs/client/views/list-specs.client.view.html',
        controller: 'SpecsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Specs List'
        }
      })
      .state('specs.create', {
        url: '/create',
        templateUrl: 'modules/specs/client/views/form-spec.client.view.html',
        controller: 'SpecsController',
        controllerAs: 'vm',
        resolve: {
          specResolve: newSpec
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Specs Create'
        }
      })
      .state('specs.edit', {
        url: '/:specId/edit',
        templateUrl: 'modules/specs/client/views/form-spec.client.view.html',
        controller: 'SpecsController',
        controllerAs: 'vm',
        resolve: {
          specResolve: getSpec
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Spec {{ specResolve.name }}'
        }
      })
      .state('specs.view', {
        url: '/:specId',
        templateUrl: 'modules/specs/client/views/view-spec.client.view.html',
        controller: 'SpecsController',
        controllerAs: 'vm',
        resolve: {
          specResolve: getSpec
        },
        data:{
          pageTitle: 'Spec {{ articleResolve.name }}'
        }
      });
  }

  getSpec.$inject = ['$stateParams', 'SpecsService'];

  function getSpec($stateParams, SpecsService) {
    return SpecsService.get({
      specId: $stateParams.specId
    }).$promise;
  }

  newSpec.$inject = ['SpecsService'];

  function newSpec(SpecsService) {
    return new SpecsService();
  }
})();
