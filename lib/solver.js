var _ = require('underscore')

exports.solve = function (cube, wordList, callback) {
    var words = []
    for (var y=0; y < cube.length; y++) {
        for (var x=0; x < cube[y].length; x++) {
            traverse(new State(y, x), cube)
        }
    }

    callback(null, words)

    function traverse(initialState, cube) {

        var queue = []
        var currentState = initialState
        while (currentState) {
            currentState.word += cube[currentState.y][currentState.x].letter
            currentState.path.push({
                'y': currentState.y,
                'x': currentState.x
            })
            handle(currentState)

            var possibleMoves = currentState.possibleMoves()
            if (possibleMoves.length > 0) {
                for (var i = possibleMoves.length - 1; i >= 0; i--) {
                    if (currentState.word.length > 16) { //TODO: Add to setting
                        continue;
                    }
                    possibleMoves[i].word = currentState.word
                    possibleMoves[i].path = currentState.path.slice()
                    queue.push(possibleMoves[i])
                }

            } 
            currentState = queue.shift()
        }
        return words
    }

    function State(y, x) {
        this.y = y
        this.x = x
        this.path = []
        this.word = ""

        this.possibleMoves = function () {
            var moves = []
            //up
            if (this.y - 1 >= 0 && !this.isCrossingPaths(this.y - 1, this.x)) {
                moves.push(new State(this.y - 1, this.x))
            }
            //right
            if(this.x + 1 < cube[this.x].length && !this.isCrossingPaths(this.y, this.x + 1)) {
                moves.push(new State(this.y, this.x + 1 ))
            }

            //down
            if (this.y + 1 < cube.length && !this.isCrossingPaths(this.y + 1, this.x)) {
                moves.push(new State(this.y + 1, this.x))
            }
            //left
            if (this.x - 1 >= 0 && !this.isCrossingPaths(this.y, this.x - 1)) {
                moves.push(new State(this.y, this.x - 1))
            }
            return moves
        }

        this.isCrossingPaths = function (y, x) {
            return _.any(this.path, function (p){ return p.y == y && p.x == x })
        }
    }

    function handle(currentState) {
        var word = currentState.word
        if (_.indexOf(wordList, word, true) >= 0) {
            words.push({'word': word, 'path': currentState.path})
        }
    }
}