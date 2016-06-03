(function() {
  'use strict';

  angular
    .module('projects')
    .controller('UploadController', UploadController);

  UploadController.$inject = ['$scope'];

  function UploadController($scope) {
    var vm = this;

    // Upload controller logic
    // ...

    init();

    function init() {
    }
  }
})();
