'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Projects',
  function ($scope, Authentication, Projects) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.projects = Projects.query();
  }
]);
