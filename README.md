# Boggle

## Files

Boggle is split into two files: gengame.js and boggle.js.
You may have to rename gengame.txt to gengame.js. Likewise for boggle.txt

gengame.js generates a valid input for boggle.js and spits it out to stdout
boggle.js takes in a board from stdin, and prints out any words found.

they can be chained together with
`node gengame.js | node boggle.js`
or
`node gengame.js | tee /dev/tty | node boggle.js`

Use the -h flag to see usage messages.

## Problem
Write a program that takes as input a board of size M x N and a dictionary (a simple list of words) and produces a list of all words that can be formed from sequences of adjacent characters in the board.  All words must contain at least 3 letters, and each letter can be used at most one time.  Please list any assumptions.

## Solution
Boggle can be solved with backtrack search over a trie. 

I first creat a trie from the dictionary of words given (words are previously filtered for those with at least 3 characters)

This trie has the special property that nodes are marked as terminal if they are the end to a complete word even if they have children.

The trie exposes two methods: `addWord(word)` to add a word to the string and `hasSubString(word, isTerminal)` to check if substring is in trie. The optional isTerminal parameter ensures the function only returns true if the substring is a terninal word in the trie.

We also have a BoggleGame class that stores the board, dictionary, and trie.
It exposes a `solve()` method that returns all words in the board.

The `solve()` method uses a backtracking algorithm that works like this.

Solve:
    For every cell in the board. 
        Backtrack(cell, [cell], foundWord)

Backtrack(cell, path, foundWord):

    path is all cells we've currently seen

    if the path is a terminal word in the tree
        call foundWord with the current path

    adjacent = all cells adjacent to the current cell
    for nextCell in adjacent:
        if we've visited nextCell:
            continue
        if path + nextCell is not a substring in the trie
            continue
        // temporarily add nextCell to path
        path = path + nextCell
        Backtrack(nextCell, path, foundWord)
        // remove nextCell from path
        path = path - nextCell# boggle
