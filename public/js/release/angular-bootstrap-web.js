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
angular.module('webApp').controller('appController', ['$scope',
    function($scope) {
        $scope.test = 'hello';
    }
]); 
angular.module('webApp').controller('puzzleController', ['$scope',
    function($scope) {
    }
]); 
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