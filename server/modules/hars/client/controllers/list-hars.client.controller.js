(function () {
  'use strict';

  angular
    .module('hars')
    .controller('HarsListController', HarsListController);

  HarsListController.$inject = ['HarsService'];

  function HarsListController(HarsService) {
    var vm = this;

    vm.hars = HarsService.query();
  }
})();
