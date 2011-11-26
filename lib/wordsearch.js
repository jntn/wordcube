var solver = require('solver')
    , _ = require('underscore')
    , placed = false
    , tries = 0
    , maxTries = 10
    , letters = "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ"


exports.createGame = function (height, width, wordList, callback, words) {
    var game = {}
    var board = exports.generateBoard(height, width, words)
    game.board = board
    solver.solve(board, wordList, function (err, word) {
        game.words = word
    })
    callback(null, game)
}

exports.generateBoard = function (height, width, words) {
    words = _.compact(words)
    var board = [];
    var number = 0;
    for (var i = 0 ; i < width ; i++) {
        board[i] = [];
        for (var j = 0 ; j < height ; j++) {
            number = number + 1;
            // We should place words on the board
            if (words) {
                board[i][j] = {
                    'letter': 'empty',
                    'number': number
                }
            } else {
                board[i][j] = {
                    'letter': choice(letters),
                    'number': number
                }
            }
        }
    }
    if (!words)    
        return board;
    else
        return insertWords(board, words)

}

function insertWords(board, words) {
    words.sort(function (a, b) {
        return b.length - a.length
    })
    _.each(words, function (word) {
        placeWordOnBoard(word, board)
    })
    fillAllEmptySquares(board)
    return board
}

function placeWordOnBoard(word, board) {
    tries = 0
    placed = false
    newBoard = null
    // Convert string to array
    splitWord = word.split("")
    var firstLetter = splitWord.shift()

    while (!placed && tries < maxTries) {
        var start = chooseRandomEmptySquare(board)
        if (start.w == -1) {
            //console.log("Could not find an empty square")
            return
        }
        tries++
        //console.log('Placing word ' + word + ', Try: ' + tries)

        placeWord(start, board, firstLetter, splitWord, word, [])
    }
    if (placed) {
        //console.log('Word ' + word + ' placed successfully!')
        //logBoard(board)
    } else {
        //console.log('Could not place word ' + word)
    }
}

function placeWord(location, board, letter, restOfWord, wordString, path) {
    if (!placed) {
        var newPath = clone(path)
        var rest = clone(restOfWord)
        location.letter = letter
        newPath.push(location)
        var nextPossibleSquares = getNextPossibleSquares(location, board, newPath)
        if (nextPossibleSquares.length == 0 && rest.length > 0) {
            //console.log('.. rewind')
            return
        }
        if (rest.length == 0) {
            placed = true
            // Ok, we found a path for word. Place it on board!
            _.each(newPath, function (l) {
                board[l.w][l.h].letter = l.letter
            })
            return
        }
        var nextLetter = rest.shift()
        _.each(nextPossibleSquares, function (nextSquareLocation) {
            placeWord(nextSquareLocation, board, nextLetter, rest, wordString, newPath)
        })
    }
}

function getNextPossibleSquares(location, board, path) {
    var moves = []
    // Up
    var newH = location.h - 1
    if (newH >= 0 && board[location.w][newH].letter == 'empty' && !isCrossingPaths(location.w, newH, path))
        moves.push({'w': location.w, 'h': newH})
    // Down
    newH = location.h + 1
    if (newH < board.length && board[location.w][newH].letter == 'empty' && !isCrossingPaths(location.w, newH, path))
        moves.push({'w': location.w, 'h': newH})
    // Right
    var newW = location.w + 1
    if (newW < board[location.w].length && board[newW][location.h].letter == 'empty' && !isCrossingPaths(newW, location.h, path))
        moves.push({'w': newW, 'h': location.h})
    // Left
    newW = location.w - 1
    if (newW >= 0 && board[newW][location.h].letter == 'empty' && !isCrossingPaths(newW, location.h, path))
        moves.push({'w': newW, 'h': location.h})
    
    // Shuffle the array
    return moves.sort(function () {
        return 0.5 - Math.random()
    })
}

function isCrossingPaths(w, h, path) {
    return _.any(path, function (p){ return p.w == w && p.h == h })
}

function chooseRandomEmptySquare(board) {
    var t = 0
    var max = 100
    var square = {}
    var w = -1
    var h = -1
    while (square.letter != 'empty' && t < max) {
        t++
        w = Math.floor(Math.random() * board[0].length)
        h = Math.floor(Math.random() * board[1].length)
        square = board[w][h]
    }
    return {'w': w, 'h': h}
}

function fillAllEmptySquares(board) {
    var empty = []
    _.each(board, function (row) {
        _.each(row, function (square) {
            if (square.letter == 'empty') {
                square.letter = choice(letters)
            }
        })
    })
}

function logBoard(b) {
    _.each(b, function(row){
        var l = _.map(row, function (l) {
            if (l.letter == 'empty') {
                return "-"
            }
            return l.letter
        })
        console.log(l.join(" "))
    })
}

// http://stackoverflow.com/questions/728360/copying-an-object-in-javascript/728694#728694
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        var len = obj.length
        for (var i = 0 ; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function choice(set) {
    return set[Math.floor(Math.random() * set.length)]
}