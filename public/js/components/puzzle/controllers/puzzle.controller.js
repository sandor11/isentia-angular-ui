(function(angular) {
    'use strict';

    angular.module('webApp').controller('puzzleController', ['$scope', '$rootScope',
        function($scope, $rootScope) {
            $scope.start = function() {
                $rootScope.$broadcast('puzzle.start');
            }
        }
    ]);
})(window.angular);