require.paths.unshift(require('path').join(__dirname, '..', 'lib'))

var assert = require('assert'),
    vows = require('vows'),
    eyes = require('eyes').inspector({maxLength: 10000}),
    wordsearch = require('wordsearch'),
    solver = require('solver'),
    fs = require('fs'),
    _ = require('underscore')

vows.describe('WordSearch').addBatch({
    'When I create a board that is 5x5': {
        topic: wordsearch.generateBoard(5,5),
        'it should be a 2 dim array each with the length of 5': function(cube) {
            assert.equal(cube.length, 5)
            assert.equal(cube[0].length, 5)
            assert.equal(cube[1].length, 5)
            assert.equal(cube[2].length, 5)
            assert.equal(cube[3].length, 5)
            assert.equal(cube[4].length, 5)
        }
    },

    'When I create a board that is 5x5': {
        topic: wordsearch.generateBoard(5,5),
        'the letters should be numbered correctly': function(cube) {
            assert.equal(cube[0][0].number, 1)
            assert.equal(cube[1][0].number, 6)
            assert.equal(cube[4][4].number, 25)
        }
    },

    'When I create a 1x1 board with the letter A': {
        topic: function() {
            solver.solve([[{'letter' : 'A'}]], ['A'], this.callback) 
        },
        'it should contain word A': function(err, words) {
            assert.length(words, 1)
            assert.equal(words[0].word, 'A')
            assert.equal(words[0].path[0].number, 1)
        }
    },

    'When I create a 2x2 board with predefined letters and words': {
        topic: function () {
            solver.solve(
            [
                [{'letter' : 'A'}, {'letter' : 'B'}],
                [{'letter' : 'C'}, {'letter' : 'D'}]
            ], ['A', 'ABDC', 'AC', 'ACDB'], this.callback)
        },
        'it should contain these words': function(err, words) {
            assert.include(_.map(words, function(word) {return word.word }), 'A')
            assert.include(_.map(words, function(word) {return word.word }), 'AC')
            assert.include(_.map(words, function(word) {return word.word }), 'ACDB')
            assert.include(_.map(words, function(word) {return word.word }), 'ABDC')
            assert.equal(words[2].word, "AC")
            assert.equal(words[2].path[0].number, 1)
            assert.equal(words[2].path[1].number, 3)
            assert.equal(words[1].word, "ABDC")
            assert.equal(words[1].path[0].number, 1)
            assert.equal(words[1].path[1].number, 2)
            assert.equal(words[1].path[2].number, 4)
            assert.equal(words[1].path[3].number, 3)
}
    },

    'When I create a 3x3 board with predefined letters and words': {
        topic: function () {
            solver.solve(
            [
                [{'x': 0, 'y': 0, 'letter' : 'A'}, {'x': 1, 'y': 0, 'letter' : 'B'}, {'x': 1, 'y': 0, 'letter' : 'C'}],
                [{'x': 0, 'y': 0, 'letter' : 'D'}, {'x': 1, 'y': 0, 'letter' : 'E'}, {'x': 1, 'y': 0, 'letter' : 'F'}],
                [{'x': 0, 'y': 1, 'letter' : 'G'}, {'x': 1, 'y': 1, 'letter' : 'H'}, {'x': 1, 'y': 0, 'letter' : 'I'}]
            ], ['A', 'ABEDGHIFC', 'ADEF'], this.callback)
        },
        'it should contain these words': function(err, words) {
            assert.include(_.map(words, function(word) {return word.word }), 'A')
            assert.include(_.map(words, function(word) {return word.word }), 'ADEF')
            assert.include(_.map(words, function(word) {return word.word }), 'ABEDGHIFC')
        }
    },

    'When I create a 5x5 board with predefined letters and words': {
        topic: function() {
            solver.solve(
            [
                [{'letter' : 'A'}, {'letter' : 'B'}, {'letter' : 'C'}, {'letter' : 'D'}, {'letter' : 'E'}],
                [{'letter' : 'F'}, {'letter' : 'G'}, {'letter' : 'H'}, {'letter' : 'I'}, {'letter' : 'J'}],
                [{'letter' : 'K'}, {'letter' : 'L'}, {'letter' : 'M'}, {'letter' : 'N'}, {'letter' : 'O'}],
                [{'letter' : 'P'}, {'letter' : 'Q'}, {'letter' : 'R'}, {'letter' : 'S'}, {'letter' : 'T'}],
                [{'letter' : 'U'}, {'letter' : 'V'}, {'letter' : 'W'}, {'letter' : 'X'}, {'letter' : 'Y'}]
            ], ['A', 'ABCDEJIHGFKLMRWVU', 'AFKLGBCDIN', 'DEJOTYX', 'VUPKFAB', 'YXWVQLGFK'], this.callback)
        },
        'it should contain these words': function(err, words) {
            assert.include(_.map(words, function(word) {return word.word }), 'A')
            assert.include(_.map(words, function(word) {return word.word }), 'ABCDEJIHGFKLMRWVU')
            assert.include(_.map(words, function(word) {return word.word }), 'AFKLGBCDIN')
            assert.include(_.map(words, function(word) {return word.word }), 'DEJOTYX')
            assert.include(_.map(words, function(word) {return word.word }), 'VUPKFAB')
            assert.include(_.map(words, function(word) {return word.word }), 'YXWVQLGFK')
        }
    },

    'When I create a 4x4 board with random letters and a big word list': {
        topic: function () {
            var wordList = fs.readFileSync(__dirname + '/wordlist.txt').toString().split('\n')
            wordList = _.map(wordList, function(word){
                if (word.length > 1) {
                    return word.toUpperCase()
                }
            })
            wordsearch.createGame(5, 5, wordList, this.callback)
        },
        'it should return an object of valid parts': function(err, game) {
            assert.isObject(game)
            assert.isArray(game.words)
            assert.isArray(game.board)
            //eyes(game)
            console.log('\nInfo:')
            console.log('  ' + game.words.length + " words in game")
            var longestWord = _.max(game.words, function(w){return w.word.length}).word
            console.log('  ' + "The longest word is " + longestWord + " (" + longestWord.length + ")")
        }
    },

    'WHen I create a cube with added words': {
        topic: function () {
            var wordList = fs.readFileSync(__dirname + '/wordlist.txt').toString().split('\n')
            wordList = _.map(wordList, function(word){
                if (word.length > 1) {
                    return word.toUpperCase()
                }
            })
            wordsearch.createGame(7, 7, wordList, this.callback, ['STOOL', 'COMPUTER', 'MOON', 'KEY', 'BOOM', 'LOOSE', 'APPLE'])//, 'FLASK', 'DOG', 'FLY', 'GROUND', 'TABLE', 'UP', 'TO'])
        },
        'the added words should be found': function (err, game) {
            //_.any(game.words, function(w) { return w.}
            assert.include(_.map(game.words, function(word) { return word.word }), 'STOOL')
            assert.include(_.map(game.words, function(word) { return word.word }), 'COMPUTER')
            assert.include(_.map(game.words, function(word) { return word.word }), 'MOON')
            assert.include(_.map(game.words, function(word) { return word.word }), 'KEY')
            assert.include(_.map(game.words, function(word) { return word.word }), 'BOOM')
            assert.include(_.map(game.words, function(word) { return word.word }), 'LOOSE')
            assert.include(_.map(game.words, function(word) { return word.word }), 'APPLE')/*
            assert.include(_.map(game.words, function(word) { return word.word }), 'FLASK')
            assert.include(_.map(game.words, function(word) { return word.word }), 'DOG')
            assert.include(_.map(game.words, function(word) { return word.word }), 'FLY')
            assert.include(_.map(game.words, function(word) { return word.word }), 'GROUND')
            assert.include(_.map(game.words, function(word) { return word.word }), 'TABLE')
            assert.include(_.map(game.words, function(word) { return word.word }), 'UP')
            assert.include(_.map(game.words, function(word) { return word.word }), 'TO')*/


        }
    }
}).export(module)
