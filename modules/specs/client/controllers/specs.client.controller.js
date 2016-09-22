(function() {
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
        vm.modalInstance = null;
        vm.closeModal = closeModal;
        //vm.getDreddReportPartial = getDreddReportPartial;



        $scope.swaggerUrl = window.location.origin + '/api/specs/' + vm.spec._id + '/swagger';

        $scope.aceLoaded = function(_editor) {
            _editor.setValue(vm.swaggerText);
            _editor.focus(); // To focus the ace editor
            _editor.$blockScrolling = Infinity;
            _editor.selection.moveTo(0, 0);
            vm.editor = _editor;
        };

        $scope.aceChanged = function(e) {
            vm.spec.swagger = JSON.parse(vm.swaggerText);
        };

        // function getDreddReportPartial() {
        //     return './modules/specs/client/views/' + vm.spec._id + '-result.html';
        // }

        function openModal() {
            vm.modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'modal.html',
                scope: $scope,
            });
        }

        function closeModal() {
            vm.modalInstance.dismiss('dismiss');
        }

        // Remove existing Spec
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.spec.$remove($state.go('specs.list'));
            }
        }

        // Validate Swagger 2.0
        function validateSwagger() {
            SwaggerParser.validate(vm.spec.swagger)
                .then(successCallback)
                .catch(errorCallback);

            function successCallback(res) {
                $scope.modalText = 'So Swagger. Much valid.';
                $scope.modalHeader = 'Pwnage!';
                openModal();
            }

            function errorCallback(res) {
                $scope.modalText = res.message;
                $scope.modalHeader = 'O Noes!';
                openModal();
            }
        }

        // Dredd test Swagger 2.0
        function testSwagger() {
            //vm.spec.$test({}, successCallback, errorCallback);
            $scope.modalText = "foooooooo";
            $scope.modalHeader = 'Pwnage!';
            openModal();

            function successCallback(res) {
                $scope.modalText = "foooooooo";
                $scope.modalHeader = 'Pwnage!';
                openModal();
                //$scope.activeTab = 1;
            }

            function errorCallback(res) {
                $scope.modalText = res.data.error;
                $scope.modalHeader = 'O Noes!';
                openModal();
            }
        }

        // Dereference
        function dereferenceSwagger(_editor) {
            SwaggerParser.dereference(vm.spec.swagger)
                .then(function(api) {
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
                .then(function(api) {
                    if (vm.spec._id) {
                        vm.spec.$update(successCallback, errorCallback);
                    } else {
                        vm.spec.$save(successCallback, errorCallback);
                    }
                })
                .catch(function(err) {
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