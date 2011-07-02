var solver = require('solver')

exports.createWordCube = function (height, width, wordList, callback) {
    var wordCube = {}
    var cube = exports.generateCube(height, width)
    wordCube.cube = cube
    solver.solve(cube, wordList, function (err, word) {
        wordCube.words = word
    })
    callback(null, wordCube)
}

exports.generateCube = function (height, width) {
    function choice(set) {
        return set[Math.floor(Math.random() * set.length)]
    }

    // Original distrobution config from Scrabble
    var letters = "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTTLLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ";
    var cube = [];
    for (var i = 0 ; i < width ; i++) {
        cube[i] = [];
        for (var j = 0 ; j < height ; j++) {
            cube[i][j] = {
                'letter': choice(letters)
            }
        }
    }
    return cube;
}