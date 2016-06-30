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