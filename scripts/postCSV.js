import fs from 'fs';
import parse from 'csv-parse';
import path from 'path';
import fetch from 'universal-fetch';
import R from 'ramda';

const absoluteUri = 'http://0.0.0.0:3004/api/v1/musics';

const fileName = path.join(__dirname, '../musics.csv') || process.argv[1];

const parseInput = input => new Promise((resolve, reject) => {
  parse(input, { auto_parse: true }, (err, output) => {
    if (err) reject(err);
    resolve(output);
  });
});

const postSong = song =>
  fetch(absoluteUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song: {
        title: song[0],
        genre: song[1],
        artist: song[2],
        album: song[3],
        time: song[4],
        year: song[5],
        rating: song[6],
      },
    }),
  });

const postSongs = songs => Promise.all(R.map(postSong)(songs));

const input = new Promise((resolve, reject) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

input
  .then(parseInput)
  .then(R.drop(1))
  .then(postSongs)
  .then(postedSongs => console.log(`${postedSongs.length} songs posted.`))
  .catch(console.error);
