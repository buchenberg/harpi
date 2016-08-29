//Hars service used to communicate Hars REST endpoints
(function () {
  'use strict';

  angular
    .module('hars')
    .factory('HarsService', HarsService);

  HarsService.$inject = ['$resource'];

  function HarsService($resource) {
    return $resource('api/hars/:harId', {
      harId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      swaggerfy: {
        method: 'POST',
        url: 'api/hars/:harId/specs'
      }
    });
  }
})();
