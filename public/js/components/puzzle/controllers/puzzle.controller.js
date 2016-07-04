(function(angular) {
    'use strict';

    angular.module('webApp').controller('puzzleController', ['$scope', '$rootScope',
        function($scope, $rootScope) {
            $scope.moves = 0;
            $scope.time = '';
            $scope.playing = false;
            $scope.complete = false;
            $scope.continue = false;

            $scope.start = function() {
                var shuffle = $scope.complete;                
                $rootScope.$broadcast('puzzle.start', shuffle);
                $scope.playing = true;
                $scope.complete = false;
                if (!$scope.continue) {
                    $scope.moves = 0;
                }
            }

            $scope.$on('puzzle.move', function(event, moves) {
                $scope.$apply(function() {$scope.moves = moves;});
            });

            $scope.$on('puzzle.retrieved', function(event, moves) {
                $scope.moves = moves;
                $scope.continue = true;
            });

            $scope.$on('puzzle.complete', function(event, time) {
                $scope.$apply(function() {
                    $scope.complete = true;
                    $scope.playing = false;
                    $scope.continue = false;
                    $scope.time = time;
                });
            });
        }
    ]);
})(window.angular);