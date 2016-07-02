(function(angular) {
    'use strict';
    
    var webApp = angular.module('webApp', ['ui.router', 'ui.bootstrap']);

    webApp.factory('appConfig', [function () {
            function getEnv() {
                return 'development';
            }

            var schemas = {
                production: {
                },
                development: {
                    name: 'isentia-angular-challenge',
                    version: '0.0.1',
                    author: 'Sandor Agafonoff',
                    license: 'MIT License'
                }
            };

            return schemas[getEnv()];
        }
    ]);

    webApp.run(['$location', '$state', '$rootScope', '$timeout', '$window', 'appConfig',
        function ($location, $state, $rootScope, $timeout, $window, appConfig) {        
            $rootScope.appConfig = appConfig;
        }
    ]);
})(window.angular);
(function(angular) {
    'use strict';
    
    angular.module('webApp').directive('ngRepeatComplete', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attr) {
                    if ($scope.$last) {
                        $timeout(function () {
                            $rootScope.$broadcast($attr.ngRepeatComplete, true);
                        });
                    }
                }
            };
        }]
    );
})(window.angular);
(function(angular) {
    'use strict';

    angular.module('webApp').controller('appController', ['$scope',
        function($scope) {
            $scope.test = 'hello';
        }
    ]); 
})(window.angular);
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
(function(angular) {
    'use strict';

    angular.module('webApp').directive('puzzle', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            return {
                restrict: 'E',
                link: function ($scope, $element, $attr) {
                    /*
                     Entry point for our puzzle game. We need to:
                     1. break puzzle apart into required number of pieces
                        1.1 Store piece order and give each piece and identifier
                     2. randomize each pieces position on the grid
                     3. watch for changes to their position
                        3.1 track each position change as a move
                        3.2 check new order against correct order
                        3.3 if puzzle is complete, 
                            3.3.1 dont accept any more moves until new game is selected
                            3.3.2 Display congratulations message to the user
                    */
                    var img = angular.element('<img />')[0];
                    img.onload = function() {
                        $element.append(img);
                    }
                    img.src = $attr.board;

                    // test code for an explode effect to begin the puzzle game
                    $scope.$on('puzzle.start', function() {
                        $(img).effect('explode', {pieces: $attr.pieces});
                    });
                }
            };
        }]
    );
})(window.angular);
(function(angular) {
    'use strict';
    
    angular.module('webApp').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise('/');
            
            $stateProvider
                    .state('app', {
                        abstract: true,
                        templateUrl: './views/components/app/app.html',
                        controller: 'appController'
                    })
                    .state('app.puzzle', {
                        url: '/',
                        templateUrl: './views/components/puzzle/puzzle.html',
                        controller: 'puzzleController'
                    });

            $locationProvider.html5Mode(true);
        }
    ]);
})(window.angular);