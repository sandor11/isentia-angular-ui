(function(angular) {
    'use strict';

    angular.module('webApp').controller('appController', ['$scope',
        function($scope) {
            $scope.test = 'hello';
        }
    ]); 
})(window.angular);