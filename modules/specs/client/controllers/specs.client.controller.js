(function () {
  'use strict';

  // Specs controller
  angular
    .module('specs')
    .controller('SpecsController', SpecsController);

  SpecsController.$inject = ['$scope', '$state', 'Authentication', 'specResolve'];

  function SpecsController ($scope, $state, Authentication, spec) {
    var vm = this;

    vm.authentication = Authentication;
    vm.spec = spec;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Spec
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.spec.$remove($state.go('specs.list'));
      }
    }

    // Save Spec
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.specForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.spec._id) {
        vm.spec.$update(successCallback, errorCallback);
      } else {
        vm.spec.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('specs.view', {
          specId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
