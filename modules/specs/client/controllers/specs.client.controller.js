(function () {
  'use strict';

  // Specs controller
  angular
    .module('specs')
    .controller('SpecsController', SpecsController);

  SpecsController.$inject = ['$scope', '$state', 'Authentication', 'specResolve', '$uibModal'];

  function SpecsController($scope, $state, Authentication, spec, $uibModal) {
    var vm = this;

    vm.authentication = Authentication;
    vm.spec = spec;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.validateSwagger = validateSwagger;
    vm.testSwagger = testSwagger;
    vm.dereferenceSwagger = dereferenceSwagger;
    vm.swaggerText = JSON.stringify(spec.swagger, null, 2);
    vm.resultText = '';
    vm.validationResultModalInstance = null;
    vm.closeModal = closeValidationResultModal;



    $scope.swaggerUrl = window.location.origin + '/api/specs/' + vm.spec._id + '/swagger';

    $scope.aceLoaded = function (_editor) {
      _editor.setValue(vm.swaggerText);
      _editor.focus(); // To focus the ace editor
      _editor.$blockScrolling = Infinity;
      _editor.selection.moveTo(0, 0);
      vm.editor = _editor;
    };

    $scope.aceChanged = function (e) {
      vm.spec.swagger = JSON.parse(vm.swaggerText);
    };

    function openValidationResultModal() {
      vm.validationResultModalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'validationResultModal.html',
        scope: $scope,
      });
    };

    function closeValidationResultModal() {
      vm.validationResultModalInstance.dismiss('dismiss');
    };

    // Remove existing Spec
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.spec.$remove($state.go('specs.list'));
      }
    }

    // Validate Swagger 2.0
    function validateSwagger() {
      SwaggerParser.validate(vm.spec.swagger)
        .then(function (api) {
          $scope.validationResultText = 'So Swagger. Much valid.'
          $scope.validationResultHeader = 'Pwnage!'
          openValidationResultModal();
        })
        .catch(function (err) {
          $scope.validationResultText = err.message;
          $scope.validationResultHeader = 'O Noes!'
          openValidationResultModal();
        });
    }

    // Validate Swagger 2.0
    function testSwagger(res) {
      vm.spec.$test(
        $state.go('specs.testResult', {
          specId: vm.spec._id
        })
      );
      console.log(res)
    }

    // Validate Swagger 2.0
    function dereferenceSwagger(_editor) {
      SwaggerParser.dereference(vm.spec.swagger)
        .then(function (api) {
          var dereferencedSwagger = JSON.stringify(api, null, 2);
          vm.editor.setValue(dereferencedSwagger, 1);
        });
    }

    // Save Spec
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.specForm');
        return false;
      }
      SwaggerParser.validate(vm.spec.swagger)
        .then(function (api) {
          if (vm.spec._id) {
            vm.spec.$update(successCallback, errorCallback);
          } else {
            vm.spec.$save(successCallback, errorCallback);
          }
        })
        .catch(function (err) {
          vm.error = err.message;
        });


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
