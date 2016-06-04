'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'FileUploader',
  function($scope, $stateParams, $location, Authentication, Projects, FileUploader) {
    $scope.authentication = Authentication;

    // Create new Project
    $scope.create = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');

        return false;
      }

      // Create new Project object
      var project = new Projects({
        title: this.title,
        description: this.description
      });

      // Redirect after save
      project.$save(function(response) {
        $location.path('projects/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.description = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Project
    $scope.remove = function(project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects[i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function() {
          $location.path('projects');
        });
      }
    };

    // Update existing Project
    $scope.update = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');

        return false;
      }

      var project = $scope.project;

      project.$update(function() {
        $location.path('projects/' + project._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Projects
    $scope.find = function() {
      $scope.projects = Projects.query();
    };

    // Find existing Project
    $scope.findOne = function() {
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      });
    };

    /*----------------------------------------------------HAR file upload------------------------------------------------------*/

    // Create file uploader instance
    var uploader = $scope.uploader = new FileUploader({
      url: '/api/projects/har',
      //queueLimit: 1,
      //alias: 'newHar'
    });

    // filters
    uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/ , options) {
        return this.queue.length < 10;
      }
    });

    // Set file uploader js filter
    // $scope.uploader.filters.push({
    //   name: 'harFilter',
    //   fn: function(item, options) {
    //     var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //     return '|json|js|'.indexOf(type) !== -1;
    //   }
    // });


    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', JSON.stringify(fileItem.file.name));
      $scope.filename = JSON.stringify(fileItem.file.name).replace(/\"/g, "");
    };

    // Called after the user selects a new har file
    // $scope.uploader.onAfterAddingFile = function(fileItem) {
    //   console.info('onAfterAddingFile', fileItem);
    //   if ($window.FileReader) {
    //     var fileReader = new FileReader();
    //     fileReader.readAsDataURL(fileItem._file);

    //     fileReader.onload = function(fileReaderEvent) {
    //       $timeout(function() {
    //         $scope.harURL = fileReaderEvent.target.result;
    //       }, 0);
    //     };
    //   }
    // };

    // Called after the user has successfully uploaded a new har
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new har
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', response);
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.upload_error = response.message;
    };

    // add har
    $scope.uploadHarFile = function() {
      // Clear messages
      $scope.success = $scope.error = null;
      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function() {
      $scope.uploader.clearQueue();
      //$scope.harURL = $scope.user.hars;
    };
  }
]);