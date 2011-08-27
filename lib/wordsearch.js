var solver = require('solver')

exports.createGame = function (height, width, wordList, callback) {
    var game = {}
    var board = exports.generateBoard(height, width)
    game.board = board
    solver.solve(board, wordList, function (err, word) {
        game.words = word
    })
    callback(null, game)
}

exports.generateBoard = function (height, width) {
    function choice(set) {
        return set[Math.floor(Math.random() * set.length)]
    }

    // Original distrobution config from Scrabble
    var letters = "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ"
    var board = [];
    var number = 0;
    for (var i = 0 ; i < width ; i++) {
        board[i] = [];
        for (var j = 0 ; j < height ; j++) {
            number = number + 1;
            board[i][j] = {
                'letter': choice(letters),
                'number': number
            }
        }
    }
    return board;
}
