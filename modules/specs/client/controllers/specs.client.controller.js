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
    vm.swagger = JSON.stringify(spec.swagger, null, 2);


    // $scope.swaggerUrl = 'http://localhost:3000/api/specs/'+vm.spec._id+'/swagger.json';
    $scope.swaggerUrl = 'http://petstore.swagger.io/v2/swagger.json';

    $scope.aceLoaded = function (_editor) {
      // Options
      //_editor.setReadOnly(true);
      _editor.setValue(vm.swagger);
      //_editor.$blockScrolling = Infinity;
      _editor.focus(); // To focus the ace editor
      _editor.selection.moveTo(0, 0);
      _editor.onCopy = function () {
        alert('What are you going to do with that text?');
      };
    };

    $scope.aceChanged = function (_editor) {
      // Options
      //_editor.setReadOnly(true);
      //_editor.setValue('ff');
      // alert('What are you going to do with that text?');
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
        vm.spec.swagger = JSON.parse(vm.swagger);
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
