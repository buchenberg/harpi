(function () {
  'use strict';

  angular
    .module('hars')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('hars', {
        abstract: true,
        url: '/hars',
        template: '<ui-view/>'
      })
      .state('hars.list', {
        url: '',
        templateUrl: 'modules/hars/client/views/list-hars.client.view.html',
        controller: 'HarsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Hars List'
        }
      })
      .state('hars.create', {
        url: '/create',
        templateUrl: 'modules/hars/client/views/form-har.client.view.html',
        controller: 'HarsController',
        controllerAs: 'vm',
        resolve: {
          harResolve: newHar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Hars Create'
        }
      })
      .state('hars.swaggerfy', {
        url: '/:harId',
        templateUrl: 'modules/hars/client/views/view-har.client.view.html',
        controller: 'HarsController',
        controllerAs: 'vm',
        resolve: {
          harResolve: makeSwagger
        },
        data:{
          pageTitle: 'swagger {{ articleResolve.name }}'
        }
      })
      .state('hars.edit', {
        url: '/:harId/edit',
        templateUrl: 'modules/hars/client/views/form-har.client.view.html',
        controller: 'HarsController',
        controllerAs: 'vm',
        resolve: {
          harResolve: getHar
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Har {{ harResolve.name }}'
        }
      })
      .state('hars.view', {
        url: '/:harId',
        templateUrl: 'modules/hars/client/views/view-har.client.view.html',
        controller: 'HarsController',
        controllerAs: 'vm',
        resolve: {
          harResolve: getHar
        },
        data:{
          pageTitle: 'Har {{ articleResolve.name }}'
        }
      });
  }

  getHar.$inject = ['$stateParams', 'HarsService'];

  function getHar($stateParams, HarsService) {
    return HarsService.get({
      harId: $stateParams.harId
    }).$promise;
  }

  newHar.$inject = ['HarsService'];

  function newHar(HarsService) {
    return new HarsService();
  }

  makeSwagger.$inject = ['$stateParams', 'SpecsService'];

  function makeSwagger($stateParams, SpecsService) {
    return SpecsService.create({
      harId: $stateParams.harId
    }).$promise;
  }


})();
