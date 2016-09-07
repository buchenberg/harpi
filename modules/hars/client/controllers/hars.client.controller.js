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
    vm.harText = JSON.stringify(har.log, null, 2);

    $scope.aceChanged = function (e) {
      vm.har.log = JSON.parse(vm.harText);
    };

    $scope.aceLoaded = function (_editor) {
      _editor.setValue(vm.harText);
      _editor.focus(); // To focus the ace editor
      _editor.$blockScrolling = Infinity;
      _editor.selection.moveTo(0, 0);
    };

    // Remove existing Har
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.har.$remove($state.go('hars.list'));
      }
    }

    // Convert existing Har to Swagger
    function swaggerfy() {
      vm.har.$swaggerfy(
        $state.go('specs.list')
      );
    }

    // Convert existing Har to UML Class Diagram
    function plantify() {
      vm.har.$plantify({},
        function (data) {
          $scope.svg = data;
        }
      );
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