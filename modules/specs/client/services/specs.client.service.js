//Specs service used to communicate Specs REST endpoints
(function () {
  'use strict';

  angular
    .module('specs')
    .factory('SpecsService', SpecsService);

  SpecsService.$inject = ['$resource'];

  function SpecsService($resource) {
    return $resource('api/specs/:specId', {
      specId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      test: {
        method: 'POST',
        url: 'api/specs/:specId/dredd'
      }
    });
  }
})();
