const getLyrics = require('./lyrics');
const readline = require('readline');

const songName = "babyPluto";
const str = getLyrics("./Songs/" + songName + ".txt");

let timeStamps = [];
let lyrics = [];
let delays = [];
let words = [];
let wordDelays = [];

var initialDelay = 0;
var gotInput = false;

// function prompt() {
//     const readline = require("readline");
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//     rl.question("Song Name: ", function (answer) {
//         this.songName = answer;
//         this.gotInput = true;

//         rl.close();
//     });
// }

function loadingLine(symbol, length, delay) {
    let line = '';
    let i = 0;
    var intervalID = setInterval(() => {
        console.clear();
        line += symbol;
        console.log(line);
        i++;
        if (i > length) clearInterval(intervalID);
    }, delay);
    initialDelay += delay;
}

function distribute() {
    const temp = str.split('\n');
    for (let i = 0; i < temp.length - 1; i++) {
        if (i % 2 == 0)
            timeStamps.push(temp[i]);
        else
            lyrics.push(temp[i]);
    }
}

// function isLetter(letter) {
//     return letter.toLowerCase() != letter.toUpperCase();
// }

// function cleanWord(word) {
//     let result = 
//     for (let i = 0; i < word.length; i++) {
//         if (isLetter(word[i]))
//             result += word[i];
//     }
// }

function convertToMS() {
    for (let i = 0; i < timeStamps.length; i++) {
        delays.push(
            parseInt(timeStamps[i].substr(0, 2)) * 60000
            + parseInt(timeStamps[i].substr(3)) * 1000
            + parseInt(timeStamps[i].substr(6, 8)) * 10
        );
    }
}

function convertToNS(ultraPrecise) {
    convertToMS();
    let c = 1;
    wordDelays.push(delays[0] + initialDelay);
    for (let i = 0; i < lyrics.length; i++) {
        let sentence = lyrics[i].split(" ");
        if (sentence[sentence.length - 1] == "")
            sentence.pop();
        for (let j = 0; j < sentence.length; j++) {
            //cleanWord(sentence[j]);
            words.push(sentence[j]);
            let wordSize = words[words.length - 1].length;
            let sentenceSize = lyrics[i].split(" ").join("").length;
            let diff = delays[i + 1] - delays[i];
            let ratio = wordSize / sentenceSize;
            let delayType = (ultraPrecise) ? (ratio *= diff) : (diff / sentence.length);
            var preciseDelay = delayType + wordDelays[c - 1];
            if (!isNaN(preciseDelay))
                wordDelays.push(preciseDelay + initialDelay);
            c++;
        }
    }
}

function printLyric(text, clear) {
    if (clear) console.clear();
    console.log(text);
}

function sync(precise, ultraPrecise) {

    distribute();
    if (precise)
        convertToNS(ultraPrecise);
    else
        convertToMS();
    const start_play = new Date();
    let i = 0;
    let length = (precise) ? wordDelays.length : delays.length;
    while (i < length) {
        const lyric_secs = (precise) ? wordDelays[i] : delays[i]; // do
        const show_lyric_msecs = start_play.getTime() + lyric_secs; // time when we want to show lyric
        const wait_time = show_lyric_msecs - new Date().getTime();
        const lyric = (precise) ? words[i] : lyrics[i];
        i++;
        setTimeout(() => printLyric(lyric, true), wait_time);
    }
    console.log('starting song...');
}


//loadingLine('█', 50, 10);

// prompt();

sync(true, true);





