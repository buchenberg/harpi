'use strict';

// Projects controller
angular
  .module('projects')
  .controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'ProjectHars', 'FileUploader',
    function ($scope, $stateParams, $location, Authentication, Projects, ProjectHars, FileUploader) {
      $scope.authentication = Authentication;
      // Create new Project
      $scope.create = function (isValid) {
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
        project.$save(function (response) {
          $location.path('projects/' + response._id);
          // Clear form fields
          $scope.title = '';
          $scope.description = '';
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };
      // Remove existing Project
      // TODO this leaves orphan har files. Remove the children.
      $scope.remove = function (project) {
        if (project) {
          project.$remove();

          for (var i in $scope.projects) {
            if ($scope.projects[i] === project) {
              $scope.projects.splice(i, 1);
            }
          }
        } else {
          $scope.project.$remove(function () {
            $location.path('projects');
          });
        }
      };

      // Update existing Project
      $scope.update = function (isValid) {
        $scope.error = null;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'projectForm');
          return false;
        }

        var project = $scope.project;

        project.$update(function () {
          $location.path('projects/' + project._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      // Find a list of Projects
      $scope.find = function () {
        $scope.projects = Projects.query();
      };

      // Find existing Project
      $scope.findOne = function () {
        $scope.project = Projects.get({
          projectId: $stateParams.projectId
        });
      };
      // List Project hars
      $scope.listHars = function () {
        $scope.projectHars = ProjectHars.query({
          projectId: $stateParams.projectId
        });
      };
      
      // urlReport
      $scope.urls = function () {
        $scope.projectHarURLs = ProjectHars.urlReport({
          projectId: $stateParams.projectId
        });
      };


      /*UPLOAD HAR FILES*/

      // Create file uploader instance
      var uploader = $scope.uploader = new FileUploader({
        url: '/api/projects/' + $stateParams.projectId + '/hars'
      });


      // CALLBACKS
      uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed ', item, filter, options);
      };

      uploader.onAfterAddingFile = function (fileItem) {
        $scope.filename = JSON.stringify(fileItem.file.name).replace(/\"/g, '');
      };

      // Called after the user has successfully uploaded a new har
      uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // Show success message
        $scope.success = true;
        // Populate project
        $scope.project = response;
        // Clear upload buttons
        $scope.cancelUpload();
      };

      // Called after the user has failed to uploaded a new har
      uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem ', response);
        // Clear upload buttons
        $scope.cancelUpload();
        // Show error message
        $scope.upload_error = response.message;
      };
      // add har
      $scope.uploadHarFile = function () {
        var file = $scope.myFile;
        // Clear messages
        $scope.success = $scope.error = null;
        // Start upload
        $scope.uploader.uploadAll();
      };
      // Cancel the upload process
      $scope.cancelUpload = function () {
        $scope.uploader.clearQueue();
      };



    }
  ]);