(function() {
  'use strict';

  angular
    .module('projects')
    .controller('UploadController', UploadController);

  UploadController.$inject = ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader'];

  function UploadController($scope, $timeout, $window, Authentication, FileUploader) {
    var vm = this;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: '/api/projects/har',
      alias: 'newHar'
    });

    // Set file uploader js filter
    $scope.uploader.filters.push({
      name: 'harFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|json|js|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.harURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // add har
    $scope.uploadHar = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      //$scope.harURL = $scope.user.hars;
    };

    init();

    function init() {
    }
  }
})();
