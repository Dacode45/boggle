
/**
 * TrieNode is used internally by Trie for storing node info
 *
 * @class TrieNode
 */
class TrieNode {
    constructor(parent, letter) {
        this.parent = parent;
        this.children = {};
        this.letter = letter;
        this.hasChildren = false;
        this.isTerminal = false;
    }


    /**
     * Does this node have a child with letter
     *
     * @param {string} letter
     * @returns boolean
     * @memberof TrieNode
     */
    hasChild(letter) {
        return !!this.children[letter];
    }


    /**
     * Does this node have any children at all
     *
     * @returns boolean
     * @memberof TrieNode
     */
    hasChildren() {
        return this.hasChildren;
    }


    /**
     * Get the child or undefined
     *
     * @param {string} letter
     * @returns TrieNode
     * @memberof TrieNode
     */
    getChild(letter) {
        return this.children[letter];
    }


    /**
     * Inserts the child into this nodes children
     *
     * @param {string} letter
     * @param {TrieNode} node
     * @returns TrieNode
     * @memberof TrieNode
     */
    setChild(letter, node) {
        this.hasChildren = true;
        return this.children[letter] = node;
    }


    /**
     * Useful for printing. Returns an array of all children indexes.
     *
     * @returns string[]
     * @memberof TrieNode
     */
    getChildrenList() {
        return Object.keys(this.children).map(l => l);
    }
}

class Trie {


    /**
     *Creates an instance of Trie.
     * @param {string[]} words
     * @memberof Trie
     */
    constructor(words) {
        this.root = new TrieNode(null, 'root');
        words.forEach(w => this.addWord(w));
    }

    /**
     * Adds a word to the Trie
     *
     * @param {string} word
     * @memberof Trie
     */
    addWord(word) {
        word = word.toLowerCase();
        let current = this.root;
        const letters = word.split('');
        for (const letter of letters) {
            if (!current.hasChild(letter)) {
                current.setChild(letter, new TrieNode(current, letter));
            }
            current = current.getChild(letter);
        }
        current.isTerminal = true;
    }


    /**
     * Checks if the substring exist in the trie
     *
     * @param {string} word
     * @param {boolean} isTerminal
     * @returns boolean
     * @memberof Trie
     */
    hasSubString(word, isTerminal) {
        word = word.toLowerCase();
        let current = this.root;
        const letters = word.split('');
        for (const letter of letters) {
            if (!current.hasChild(letter)) {
                return false;
            }
            current = current.getChild(letter);
        }
        // ensure current is terminal;
        if (isTerminal) return current.isTerminal;
        return true;
    }
}


/**
 * Encapsulates a game of boggle.
 *
 * @class BoggleGame
 */
class BoggleGame {
    
    /**
     *Creates an instance of BoggleGame.
     * @param {number} width
     * @param {number} height
     * @param {string[]} board
     * @param {string[]} dictionary
     * @memberof BoggleGame
     */
    constructor(width, height, board, dictionary) {
        this.width = width;
        this.height = height;
        this.board = board;
        this.dictionary = dictionary;
        this.trie = new Trie(this.dictionary);
    }

    /**
     * Performs backtrack search on the trie for potential words
     * @callback foundWordCallback
     * 
     * @param {string} currentWord The word we are currently checking
     * @param {number} currentCell The index in the board we are on
     * @param {number[]} path Previous indicies we have visited
     * @param {number} depth Current depth in search. Not used for anything but printing
     * @param {found} foundWord Function to call when we found a word
     * @memberof BoggleGame
     */ 
    backTrack(currentWord, currentCell, path, depth, foundWord) {
        // Check if current word is in dictionary
        if (currentWord.length >= 3 && this.trie.hasSubString(currentWord, true)) {
            // console.log(`backtrack: ${currentWord}, ${currentCell}, ${depth}, ${this.board.length}`)
            foundWord(currentWord);
        }
        depth += 1;
        const adjacent = this.getAdjacent(currentCell);
        for (const nextCell of adjacent) {
            // check if we've visited this cell
            if (path.indexOf(nextCell) !== -1) continue;
            const nextLetter = this.board[nextCell]
            const nextWord = currentWord + nextLetter;
            // checkc that the next word is a substring in the dictionary
            if (!this.trie.hasSubString(nextWord)) continue;
            
            path.push(nextCell);
            this.backTrack(nextWord, nextCell, path, depth, foundWord);
            path.pop();
        }
    }

    /**
     * Finds all words in board
     * @returns string[]
     * @memberof BoggleGame
     */
    solve() {
        const words = [];
        const foundWord = (word) => {
            // ensure uniqueness
            if (words.indexOf(word) !== -1) return;
            words.push(word)
        };
        // solve using the backtracking algorithm
        this.board.forEach((letter, i) => {
            // backtrack for all 8 adjacent cells
            this.backTrack(letter, i, [], 0, foundWord);
        })
        return words;
    }


    /**
     * Returns neighbors of i in the board. Ensures that neighbors are always in bounds
     *
     * @param {number} i
     * @returns number[]
     * @memberof BoggleGame
     */
    getAdjacent(i) {
        return [
            i -(this.width + 1),
            i -(this.width),
            i -(this.width - 1),
            i -1,
            i +1,
            i + (this.width - 1),
            i + (this.width),
            i + (this.width + 1),
        ].filter(j => this.isValidCell(j))
    }


    /**
     * Checks that this number is nonNegative and less than the size of the board
     *
     * @param {number} i
     * @returns boolean
     * @memberof BoggleGame
     */
    isValidCell(i) {
        return i >= 0 && i < this.board.length;
    }
}



/**
 * Prints usage message
 *
 * @returns string
 */
function usage() {
    return `
    Usage: node [options] ${__filename} [-h]
    
Reads board details from stdin.

First line: width of the board (M)
Second line: height of the board (N)
Next N lines: board
All other lines: words in dictionary

Ex.

5
5
wnfta
ulweo
eatde
hknar
theet
the
be
to
of
and
a
in
that
have
I
it
for
not
    `;
}


/**
 * Solves a boggle string
 *
 * @param {string} input
 */
function processData(input) {
    //Enter your code here
    const lines = input.split('\n');
    const width = Number(lines[0]);
    const height = Number(lines[1]);

    if (isNaN(width) || isNaN(height)) {
        console.log(`The first two lines must be with and height`);
        console.log(usage());
        process.exit(1);
    }
    
    // Ensure a valid board
    if (lines.slice(2, 2 + height).some(line => line.length != width)) {
        console.log(`Invalid input: Board rows should be the same size`);
        console.log(usage());
        process.exit(1);
    }

    if (lines.length < 2 + height + 1) {
        console.log(`Invalid input`);
        console.log(usage());
        process.exit(1)
    }

    const board = lines
        .slice(2, 2 + height) // get the board as an array of strings
        .join('') // join the strings into a singular string
        .split('') // convert the singular string into an array of letters

    // filter dictionary to only include the words with a length greater than 3
    const dictionary = lines.slice(2 + height).filter(word => word.length >= 3);

    const game = new BoggleGame(width, height, board, dictionary);
    const words = game.solve();
    for (const word of words) {
        console.log(word);
    }
} 
// check for usage
process.argv.forEach((arg) => {
    if (arg === '-h') {
        console.log(usage());
        process.exit(1);
    }
})

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});