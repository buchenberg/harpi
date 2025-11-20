(function () {

    'use strict';

    // Hars controller
    angular
        .module('hars')
        .controller('HarsController', HarsController);

    HarsController.$inject = ['$scope', '$state', 'Authentication',
        'harResolve', '$timeout', '$uibModal'
    ];

    function HarsController($scope, $state, Authentication, har, $timeout, $uibModal) {
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
        vm.closeModal = closeErrorModal;

        // Watch for mermaid changes and render
        $scope.$watch('vm.har.mermaid', function(newVal) {
          if (newVal) {
            $timeout(function() {
              renderMermaid();
            }, 300);
          }
        });
        
        // Initialize Mermaid rendering if diagram exists
        if (vm.har.mermaid) {
          $timeout(function() {
            renderMermaid();
          }, 300);
        }

        $scope.schema = {
            type: "object",
            properties: {
                entries: {
                    type: "array",
                    items:
                    {
                        title: "Entry",
                        type: "object",
                        properties: {
                            "x-service-name": {
                                title: "Service Name",
                                type: "string",
                                description: "e.g. 'Widget'"
                            },
                            "x-resource-name": {
                                title: "Resource Name",
                                type: "string",
                                description: "e.g. 'Widget'"
                            },
                            "request": {
                                title: "Request",
                                type: "object",
                                properties: {
                                    "method": {
                                        title: "Method",
                                        type: "string"
                                    },
                                    "url": {
                                        title: "URL",
                                        type: "string"
                                    }
                                }
                            },
                            "response": {
                                title: "Response",
                                type: "object",
                                properties: {
                                    "status": {
                                        title: "Status",
                                        type: "string"
                                    },
                                    "statusText": {
                                        title: "Status Text",
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.model = har.log;

        $scope.aceChanged = function (e) {
            vm.har.log = JSON.parse(vm.harText);
        };

        $scope.aceLoaded = function (_editor) {
            _editor.setValue(vm.harText);
            _editor.focus(); // To focus the ace editor
            _editor.$blockScrolling = Infinity;
            _editor.selection.moveTo(0, 0);
        };

        function showErrorModal() {
            vm.errorModalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'errorModal.html',
                scope: $scope,
            });
        }

        function closeErrorModal() {
            vm.errorModalInstance.dismiss('dismiss');
        }

        // Remove existing Har
        function remove() {
            if (confirm('Are you sure you want to delete?')) {
                vm.har.$remove($state.go('hars.list'));
            }
        }

        // Convert existing Har to Swagger
        function swaggerfy() {

            vm.har.$swaggerfy({}, successCallback, errorCallback);

            function successCallback(res) {
                $state.go('specs.list');
            }

            function errorCallback(res) {
                $scope.errorHeader = res.data.message.name;
                $scope.errorText = res.data.message.message;
                showErrorModal();
            }
        }

        // Convert existing Har to UML Sequence Diagram (Mermaid)
        function plantify() {
            vm.har.$plantify({}, successCallback, errorCallback);

            function successCallback(res) {
                // Update the har object with the response
                vm.har = res;
                // Render Mermaid diagram
                $timeout(function() {
                    renderMermaid();
                }, 100);
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }

        // Render Mermaid diagram
        function renderMermaid() {
            if (typeof mermaid !== 'undefined' && vm.har.mermaid) {
                var diagramElement = document.getElementById('mermaid-diagram-' + vm.har._id);
                if (diagramElement && vm.har.mermaid) {
                    try {
                        // Check if already rendered (has SVG child)
                        var existingSvg = diagramElement.querySelector('svg');
                        if (existingSvg) {
                            existingSvg.remove(); // Remove old rendering
                        }
                        
                        // Set the Mermaid text
                        diagramElement.textContent = vm.har.mermaid;
                        
                        // Trigger Mermaid to render (for dynamically added content)
                        // Mermaid v10 will auto-render elements with class 'mermaid' when contentLoaded is called
                        if (mermaid.contentLoaded) {
                            mermaid.contentLoaded();
                        } else if (mermaid.run) {
                            // Alternative API for Mermaid v10
                            mermaid.run({
                                nodes: [diagramElement]
                            });
                        }
                    } catch (err) {
                        console.error('Error rendering Mermaid diagram:', err);
                    }
                }
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