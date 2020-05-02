const getLyrics = require('./lyrics');
const readline = require('readline');

const songName = "choose-your-song-here";

let timeStamps = [];
let lyrics = [];
let delays = [];
let words = [];
let wordDelays = [];

function distribute() {
    const rawLyrics = getLyrics("./Songs/" + songName + ".txt").split("\n");
    for (let i = 0; i < rawLyrics.length - 1; i++) {
        if (i % 2 == 0)
            timeStamps.push(rawLyrics[i]);
        else
            lyrics.push(rawLyrics[i]);
    }
}

function isValidChar(c) {
    return c.toLowerCase() != c.toUpperCase() || !isNaN(c) || c == '\'';
}

function cleanWord(word) {
    let c = 0;
    let result = "";
    for (let i = 0; i < word.length; i++) {
        if (isValidChar(word[i]))
            result += word[i];
        else
            c++;
    }
    for (let i = 0; i < c; i++) result += " ";
    return result;
}

function printLyric(text, clear) {
    if (clear) console.clear();
    console.log(text);
}

function setPhraseDelays() {
    for (let i = 0; i < timeStamps.length; i++) {
        delays.push(
            parseInt(timeStamps[i].substr(0, 2)) * 60000
            + parseInt(timeStamps[i].substr(3)) * 1000
            + parseInt(timeStamps[i].substr(6, 8)) * 10
        );
    }
}

function setWordDelays(relative) {
    setPhraseDelays();
    wordDelays.push(delays[0]);
    for (let i = 0; i < lyrics.length; i++) {
        let phrase = lyrics[i].split(" ");
        if (phrase[phrase.length - 1] == "") phrase.pop();
        for (let j = 0; j < phrase.length; j++) {
            words.push(cleanWord(phrase[j]));
            let currentChars = words[words.length - 1].length
            let numOfChars = lyrics[i].split(" ").join("").length;
            let delayType;
            if (relative) {
                let ratio = currentChars / numOfChars;
                delayType = (ratio *= diff);
            } else {
                let diff = delays[i + 1] - delays[i];
                delayType = (diff / phraseType);
            }
            var preciseDelay = delayType + wordDelays[wordDelays.length - 1];
            if (!isNaN(preciseDelay))
                wordDelays.push(preciseDelay);
        }
    }
}

/**
 * call the sync() method to run the program. set the first parameter to true
 * if you want to sync the lyrics by word, not by sentence. set the second parameter
 * to true if you want to sync the words relative to the length of the sentence 
 * (shorter words will be on the screen for a shorter period of time, and vice versa).
 * @param {*} precise 
 * @param {*} relative 
 */
function sync(precise, relative) {
    distribute();
    if (precise)
        setWordDelays(relative);
    else
        setPhraseDelays();
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
