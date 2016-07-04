(function(angular, $) {
    'use strict';

    angular.module('webApp').factory('puzzleFactory', ['$rootScope', '$window', 'puzzleSaveService', 'puzzleTimerService',
        function($rootScope, $window, saver, timer) {
            function Puzzle(rows, pieces, width, board) {
                // our puzzle attributes
                this.rows = rows;
                this.pieces = pieces;
                this.width = width;
                this.board = board;
	            this.size = this.width / this.rows;
                this.moves = 0;
                this.time = 0;

                // our working DOM items and data
                this.container = null;
                this.startingOrder = [];
                this.shuffledOrder = [];

                this.getContainer = function() {
                    return this.container;
                }

                /**
                 * Save the state of our game, including the current number of moves
                 * and current board positons of our puzzle pieces
                 */
                this.save = function() {
                    saver.save([].slice.call(this.container[0].children), this.startingOrder, this.moves, timer.time() + this.time);
                }

                /**
                 * Retrieve the state of our game from local storage and apply
                 * the previous data to our game board
                 */
                this.retrieve = function() {
                    var state = saver.retrieve();
                    this.moves = state.moves;
                    this.time = state.time;
                    this.createPieceOrder(state.positions);
                    this.position();
                }

                /**
                 * Order our pieces according to our saved positions
                 */
                this.createPieceOrder = function(positions) {
                    this.shuffledOrder = [];
                    for(var i = 0; i < this.startingOrder.length; i++) {
                        var pos = positions[i];
                        var item = this.startingOrder[pos];
                        this.shuffledOrder.push(item);
                    }
                }

                /**
                 * Notify that a move has been made
                 */
                this.notifyMoveCompleted = function() {
                    var broadcastMoves = this.moves;
                    $rootScope.$broadcast('puzzle.move', broadcastMoves);
                }
            }

            /**
             * Create holding container <ul> for our puzzle pieces
             */
            Puzzle.prototype.createContainerElement = function() {
                this.container = angular.element('<ul/>');
                this.container[0].style.width = this.width + 'px';
                this.container[0].style.height = this.width + 'px';
                this.container[0].className = 'puzzle-board list-unstyled m-0-auto fs-0';
                return this.container;
            }

            /**
             * Create our puzzle grid
             */
            Puzzle.prototype.createPieces = function() {
                var currentRow = 0;
                var currentCol = 0;
                for(var i = 1; i <= this.pieces; i++) {
                    // get our background positions for the current grid position
                    var horiz = currentCol * this.size;
                    var vert = currentRow * this.size;

                    // create our puzzle piece
                    var li = this.createPieceElement(i, horiz, vert);

                    // add the piece to our holding container
                    //this.container.append(li);

                    // add to the starting order for comparison during the game
                    this.startingOrder.push(li[0]);
                    this.shuffledOrder.push(li[0]);

                    // work out next grid position
                    if (i && (i % this.rows === 0)) {
                        currentRow++;
                        currentCol = 0;
                    }
                    else {
                        currentCol++;
                    }
                }
            }

            /**
             * Create puzzle piece elements <li>
             */
            Puzzle.prototype.createPieceElement = function(order, horiz, vert) {
                // create an individual puzzle piece
                var li = angular.element('<li />');
                li[0].style.width = this.size + 'px';
                li[0].style.height = this.size + 'px';
                li[0].className = 'order-' + order + ' puzzle-piece inline-block area-clickable';

                // posiziton our image mask
                li[0].style.backgroundImage = 'url(' + this.board + ')';
                li[0].style.backgroundRepeat = 'no-repeat';
                li[0].style.backgroundSize = this.width + 'px ' + this.width + 'px';
                li[0].style.backgroundPosition = '-' + horiz + 'px ' + '-' + vert + 'px';
                return li;
            }

            /**
             * Creates and returns a <div> container which holds our puzzle pieces
             */
            Puzzle.prototype.generate = function() {
                this.createContainerElement();
                this.createPieces();
                return this.container;
            }

            /**
             * Shuffle our board pieces
             */
            Puzzle.prototype.shuffle = function() {
                randomize(this.shuffledOrder);

                for (var i = 0; i < this.shuffledOrder.length; i++) {
                    this.container[0].appendChild(this.shuffledOrder[i]);
                }
            }

            /**
             * Code snippet for randomizing array (https://css-tricks.com/snippets/javascript/shuffle-array/)
             */
            function randomize(o) {
                for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            };

            /**
             * Position our pieces from where we saved last
             */
            Puzzle.prototype.position = function() {
                for (var i = 0; i < this.shuffledOrder.length; i++) {
                    this.container[0].appendChild(this.shuffledOrder[i]);
                }
            }

            Puzzle.prototype.start = function() {
                // apply jQuery sortable to our puzzle board
                // enables drag and drop plus element sorting
                $('.puzzle-board').sortable({
                    revert: true,
                    stop: this.move.bind(this) // we must check the new order agains our start order
                });
                $('.puzzle-board').disableSelection();
                timer.start();
            }

            /**
             * Called from our jQuery sortable stop event. Will give us the
             * right timing to test our DOM structure for puzzle completion
             */
            Puzzle.prototype.move = function(event, ui) {
                // add move count
                this.moves++;
                this.notifyMoveCompleted();

                // save our state here since a move was completed
                this.save();

                // check if puzzle has been completed and cancel sorting
                // operations if it has
                if (this.complete()) {
                    timer.stop();
                    // reset our internals
                    this.moves = 0;
                    $window.localStorage.removeItem('isentia.puzzle');

                    // disable dragging/sorting
                    $('.puzzle-board').sortable('destroy');

                    // notify puzzle completion
                    var totalTimeTaken = timer.time() + this.time;
                    $rootScope.$broadcast('puzzle.complete', totalTimeTaken);
                }
            }

            /**
             * Check puzzle for completeness. We can simply check the object
             * references for each array element since we added references
             * to the real DOM nodes in our start order, and our shuffledOrder
             * simply references the real DOM nodes collection post sort
             */
            Puzzle.prototype.complete = function() {
                for (var i = 0; i < this.startingOrder.length; i++) {
                    if (this.container[0].children[i] !== this.startingOrder[i]) {
                        return false;
                    }
                }
                return true;
            }

            return {
                instance: function(rows, pieces, width, board) {
                    var puzzle = new Puzzle(rows, pieces, width, board);
                    puzzle.generate();
                    if ($window.localStorage['isentia.puzzle']) {
                        // resotre the puzzle piece order from previously save positions
                        puzzle.retrieve();
                        $rootScope.$broadcast('puzzle.retrieved', puzzle.moves);
                    }
                    else {
                        // shuffle a new puzzle
                        puzzle.shuffle();
                    }
                    return puzzle;
                }
            };
        }
    ]);
})(window.angular, $);