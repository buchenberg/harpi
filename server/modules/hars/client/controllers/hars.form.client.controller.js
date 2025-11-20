(function () {

    'use strict';

    // Hars controller
    angular
        .module('hars')
        .controller('HarsFormController', HarsFormController);

    HarsFormController.$inject = ['$scope'];

    function HarsFormController($scope) {
        var vm = this;

        $scope.schema = {
            type: "object",
            properties: {
                resource: { 
                    type: "string", 
                    minLength: 2, 
                    title: "Resource", 
                    description: "Resource name or alias" }
               
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.model = {};


    }
})();