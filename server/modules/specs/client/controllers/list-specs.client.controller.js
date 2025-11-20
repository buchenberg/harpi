(function () {
  'use strict';

  angular
    .module('specs')
    .controller('SpecsListController', SpecsListController);

  SpecsListController.$inject = ['SpecsService'];

  function SpecsListController(SpecsService) {
    var vm = this;

    vm.specs = SpecsService.query();
  }
})();
