(function () {
  'use strict';

  // Hars controller
  angular
    .module('hars')
    .controller('HarsController', HarsController);

  HarsController.$inject = ['$scope', '$state', 'Authentication', 'harResolve'];

  function HarsController ($scope, $state, Authentication, har) {
    var vm = this;

    vm.authentication = Authentication;
    vm.har = har;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Har
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.har.$remove($state.go('hars.list'));
      }
    }

    // Save Har
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.harForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.har._id) {
        vm.har.$update(successCallback, errorCallback);
      } else {
        vm.har.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('hars.view', {
          harId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
