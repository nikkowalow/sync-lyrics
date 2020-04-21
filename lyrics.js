var fs = require('fs');

function getLyrics(songName) {
    try {
        return fs.readFileSync(songName, 'utf8');
    } catch (e) {
        console.log('Error:', e.stack);
    }
}

module.exports = getLyrics;