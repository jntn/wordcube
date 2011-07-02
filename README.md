# wordcube #

A library to create cubes of letters with hidden words. The words can be found by tracing in any direction horizontilly or vertically. Here is an example with the word PUZZLE highlighted.
<table>
    <tr>
        <td>A</td>
        <td><b>P</b></td>
        <td>E</td>
        <td>P</td>
        <td>N</td>
    </tr>

    <tr>
        <td>H</td>
        <td><b>U</b></td>
        <td><b>Z</b></td>
        <td><b>Z</b></td>
        <td>Q</td>
    </tr>

    <tr>
        <td>K</td>
        <td>J</td>
        <td><b>E</b></td>
        <td><b>L</b></td>
        <td>I</td>
    </tr>

    <tr>
        <td>S</td>
        <td>P</td>
        <td>M</td>
        <td>N</td>
        <td>Y</td>
    </tr>

    <tr>
        <td>D</td>
        <td>I</td>
        <td>X</td>
        <td>G</td>
        <td>A</td>
    </tr>
</table>

To create a 5x5 word cube with random words from a word list:

    wordcube = require('wordcube')
    wordcube.createWordcube(5, 5, wordList, function(cube){
    	// cube is the word cube!
    })

The word list is a sorted array of uppercase words.