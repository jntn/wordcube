# wordcube #

A library to create cubes of letters with hidden words. The words can be found by tracing in any direction horizontilly or vertically.

a  **P**  e  p  n  
h  **U**  **Z**  **Z**  q  
k  j  **E**  **L**  l  
s  e  m  e  y  
d  i  x  g  a  

To create a 5x5 word cube with random words from a word list:

    wordcube = require('wordcube')
    wordcube.createWordcube(5, 5, wordList, function(cube){
    	// cube is the word cube!
    })

The word list is a sorted array of uppercase words.