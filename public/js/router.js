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