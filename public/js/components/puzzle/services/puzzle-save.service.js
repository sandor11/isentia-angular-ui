(function(angular, $) {
    'use strict';

    angular.module('webApp').service('puzzleSaveService', ['$window',
        function($window) {
            this.save = function(currentBoard, startingOrder, moves, time) {
                var positions = [];
                // use snapshot of our current board state
                currentBoard.forEach(function(current) {
                    // check the position of each piece against the starting order
                    // so we can reinstate the pieces position from its location 
                    // in the start order
                    var shuffledPosition = startingOrder.indexOf(current);
                    positions.push(shuffledPosition);
                });
                var state = {
                    positions: positions,
                    moves: moves,
                    time: time
                }
                $window.localStorage['isentia.puzzle'] = JSON.stringify(state);
            }

            this.retrieve = function() {
                return JSON.parse($window.localStorage['isentia.puzzle']);
            }

            return this;
        }
    ]);
})(window.angular, $);