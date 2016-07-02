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

    angular.module('webApp').directive('puzzle', ['$rootScope', '$timeout', 'puzzleFactory',
        function ($rootScope, $timeout, puzzleFactory) {
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

                    // extract our config options from out puzzle element
                    var rows = +$attr.rows;
                    var pieces = +$attr.pieces;
                    var width = +$attr.width;
                    var src = $attr.board;

                    var puzzle = puzzleFactory.instance(rows, pieces, width, src);
                    var container = puzzle.generate();
                    $element.append(container);

                    // test code for an explode effect to begin the puzzle game
                    $scope.$on('puzzle.start', function() {
                        puzzle.shuffle();
                    });
                }
            };
        }]
    );
})(window.angular);
(function(angular, $) {
    'use strict';

    angular.module('webApp').factory('puzzleFactory', ['$rootScope',
        function($rootScope) {
            function Puzzle(rows, pieces, width, board) {
                // our puzzle attributes
                this.rows = rows;
                this.pieces = pieces;
                this.width = width;
                this.board = board;

                // our working DOM items and data
                this.container = null;
                this.img = null;
                this.startingOrder = [];

                this.createBoard = function() {
                    // create our image to be applied to each piece
                    this.img = angular.element('<img />')[0];

                    // we will define an onload event which will trigger the creation
                    // of our individual pieces
                    this.img.onload = this.createPieces.bind(this);

                    // image display settings
                    this.img.className = 'width-100';
                    this.img.src = this.board;
                }

                this.createContainer = function() {
                    // create holding container for our puzzle pieces
                    this.container = angular.element('<div />');
                    this.container[0].style.width = this.width + 'px';
                    this.container[0].style.height = this.width + 'px';
                    this.container[0].className = 'm-0-auto';
                }

                this.createPieces = function() {
                    var size = this.width / this.rows;
                    var piece = {
                        width: size,
                        height: size
                    };
                    for(var i = 0; i < this.pieces; i++) {
                        // create an individual puzzle piece
                        var div = angular.element('<div />');
                        div[0].style.width = piece.width + 'px';
                        div[0].style.height = piece.height + 'px';
                        div[0].className = 'inline-block';

                        // clone our image into the puzzle piece
                        div.append($(this.img).clone());

                        // add the piece to our holding container
                        this.container.append(div);
                        this.startingOrder.push(div);
                    }
                }
            }

            Puzzle.prototype.generate = function() {
                this.createContainer();
                this.createBoard();
                return this.container;
            }

            Puzzle.prototype.shuffle = function() {
                var el = this.container[0];
                for (var i = el.children.length; i >= 0; i--) {
                    el.appendChild(el.children[Math.random() * i | 0]);
                }
            }

            return {
                instance: function(rows, pieces, width, board) {
                    return new Puzzle(rows, pieces, width, board);
                }
            };
        }
    ]);
})(window.angular, $);
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