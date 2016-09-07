(function () {
  'use strict';

  // Specs controller
  angular
    .module('specs')
    .controller('SpecsController', SpecsController);

  SpecsController.$inject = ['$scope', '$state', 'Authentication', 'specResolve'];

  function SpecsController($scope, $state, Authentication, spec) {
    var vm = this;

    vm.authentication = Authentication;
    vm.spec = spec;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.swaggerText = JSON.stringify(spec.swagger, null, 2);


    $scope.swaggerUrl = window.location.origin+'/api/specs/'+vm.spec._id+'/swagger.json';

    $scope.aceLoaded = function (_editor) {
      _editor.setValue(vm.swaggerText);
      _editor.focus(); // To focus the ace editor
      _editor.$blockScrolling = Infinity;
      _editor.selection.moveTo(0, 0);
    };

    $scope.aceChanged = function (e) {
      vm.spec.swagger = JSON.parse(vm.swaggerText);
    };

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
