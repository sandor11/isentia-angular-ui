(function(angular, $) {
    'use strict';

    angular.module('webApp').service('puzzleTimerService', ['$window',
        function($window) {
            var interval;

            function init() {
                interval = {};
            }

            this.start = function() {
                init();
                interval.start = moment();
            }

            this.stop = function() {
                interval.stop = moment();
            }

            this.time = function() {
                // this will be called periodically throughout the game so we need
                // to make sure we are tracking time of either the interval stop point or the
                // current time
                var stop = interval.hasOwnProperty('stop') ? interval.stop : moment();
                var totalSeconds = stop.diff(interval.start, 'seconds');
                return totalSeconds;
            }
        }
    ]);
})(window.angular, $);