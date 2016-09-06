(function () {
  'use strict';

  // Hars controller
  angular
    .module('hars')
    .controller('HarsController', HarsController);

  HarsController.$inject = ['$scope', '$state', 'Authentication',
    'harResolve'
  ];

  function HarsController($scope, $state, Authentication, har) {
    var vm = this;



    vm.authentication = Authentication;
    vm.har = har;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.swaggerfy = swaggerfy;
    vm.plantify = plantify;
    vm.save = save;

    //$scope.harText = JSON.stringify(har, null, 2);

    $scope.aceLoaded = function (_editor) {
      // Options
      _editor.setReadOnly(true);
      _editor.setValue(JSON.stringify(har.log, null, 2));
      _editor.$blockScrolling = Infinity;
      _editor.focus(); // To focus the ace editor
      _editor.selection.moveTo(0, 0);
      _editor.onCopy = function () {
        alert('What are you going to do with that text?');
      };

    };

    // Remove existing Har
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.har.$remove($state.go('hars.list'));
      }
    }

    // Convert existing Har to Swagger
    function swaggerfy() {
      if (confirm('Are you sure you want to swaggerfy?')) {
        vm.har.$swaggerfy(
          $state.go('specs.list')
        );
      }
    }

    // Convert existing Har to UML Class Diagram
    function plantify() {
      if (confirm('Are you sure you want to planitify?')) {
        vm.har.$plantify();
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
