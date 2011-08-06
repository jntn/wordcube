var _ = require('underscore')

var queue = []
var currentState = []
var smartWordList

exports.solve = function (cube, wordList, callback) {
	smartWordList = new SmartWordList(wordList)
    var words = []
    for (var y=0; y < cube.length; y++) {
        for (var x=0; x < cube[y].length; x++) {
            traverse(new State(y, x))
        }
    }

    callback(null, words)

    function traverse(initialState) {
        queue = []
        currentState = initialState
        while (currentState) {
            currentState.word += cube[currentState.y][currentState.x].letter
            currentState.path.push({
                'y': currentState.y,
                'x': currentState.x
            })
            if (isOnRightTrack(currentState)) {
				addWordIfInList(currentState)
	            if (currentState.word.length <= 16) {
                var possibleMoves = currentState.getPossibleMoves()
                	if (possibleMoves.length > 0) {
                    	for (var i = possibleMoves.length - 1; i >= 0; i--) {
                        	possibleMoves[i].word = currentState.word
                        	possibleMoves[i].path = currentState.path.slice()
                        	queue.push(possibleMoves[i])
                    	}
                	} 
            	}
			}



            currentState = queue.pop()
        }
        return words
    }

    function State(y, x) {
        this.y = y
        this.x = x
        this.path = []
        this.word = ""

        this.getPossibleMoves = function () {
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

    function isOnRightTrack(currentState) {
		if (_.indexOf(smartWordList.getWordList(currentState.word.length), currentState.word, true) != -1) return true
		return false
    }

	function addWordIfInList(currentState) {
		if (_.indexOf(wordList, currentState.word, true) != -1) {
        	words.push({'word': currentState.word, 'path': currentState.path})
    	}
	}
	
	function SmartWordList(wordList) {
		this.wordList = wordList
		this.collectionOfWordLists = {}
		this.getWordList = function(i) {
			//console.log(i)
			if (i == null) return wordList
			if (this.collectionOfWordLists[i] == null) {
				var modifiedWordList = _.map(wordList, function(word){
					if (word === undefined) return
					var shortWord = word.slice(0, i)
					return shortWord
				})
				//console.log("Created w with length of " + i)
				this.collectionOfWordLists[i] = modifiedWordList
				return modifiedWordList
			} else {
				return this.collectionOfWordLists[i]
			}
		}
	}
}