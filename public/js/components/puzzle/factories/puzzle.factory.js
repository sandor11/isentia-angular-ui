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