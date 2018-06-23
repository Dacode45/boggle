let width = 5;
let height = 5;
const alphabet = "abcdefghijklmnopqrstuvwxyz";

const commonWords = require('./words.json');
const words = commonWords.reduce((acc, word) => {
    return acc += word.word + '\n'
}, '');

// width and height

// check usage
process.argv.forEach((arg) => {
    if (arg === '-h') {
        console.log(usage());
        process.exit(1);
    }
})

// override from input
const input = process.argv.slice(2, 4).map(Number);
if (input[0] && !isNaN(input[0])) {
    width = input[0];
}
if (input[1] && !isNaN(input[1])) {
    height = input[1];
}

const output = 
`${width}
${height}
${randomBoard(width, height)}${words}
`;

console.log(output);

function randomWord(width) {
    let text = '';
    for (let i = 0; i < width; i++) {
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return text;
}

function randomBoard(width, height) {
    let board = '';
    for (let i = 0; i < height; i++) {
        board += randomWord(width) + '\n';
    }
    return board;
}

function usage() {
    return `
    Usage: node [options] ${__filename} [-h] <width = 5> <height = 5>
    Outputs random input for boggle.js
    `
}