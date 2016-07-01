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