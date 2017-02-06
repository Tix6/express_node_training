import eventEmitter from 'events';
import R from 'ramda';

class Musics extends eventEmitter {
  constructor() {
    super();
    this.id = 0;
    this.musics = [];
    this.playlist = [];
  }

  selectByFilter(filter) {
    if (!filter) return R.identity;

    let patterns = R.split(' ')(filter);
    patterns = R.map(p => RegExp(R.toLower(p)))(patterns);

    const isMatchingPattern = ({ title, artist, genre, album }, pattern) =>
      (R.test(pattern, R.toLower(title)) ||
      R.test(pattern, R.toLower(artist)) ||
      R.test(pattern, R.toLower(genre)) ||
      R.test(pattern, R.toLower(album)));

    return R.filter(music =>
         R.all(pattern => isMatchingPattern(music, pattern), patterns));
  }

  selectByRecent(quantity) {
    if (!quantity) return R.identity;
    const sortByDate = (m1, m2) => m2.dateAdded.getTime() - m1.dateAdded.getTime();
    return R.compose(R.take(quantity), R.sort(sortByDate));
  };

  selectByTop(quantity) {
    if (!quantity) return R.identity;
    return R.compose(R.take(quantity), R.reverse, R.sortBy(R.prop('rating')));
  }

  selectByTopPlayed(quantity) {
    if (!quantity) return R.identity;
    return R.compose(R.take(quantity), R.reverse, R.sortBy(R.prop('playCount')));
  }

  load({ filter, recent, top, topPlayed }) {
    return R.compose(
      this.selectByTopPlayed(topPlayed),
      this.selectByTop(top),
      this.selectByRecent(recent),
      this.selectByFilter(filter))(this.musics);
  }

  getRandomSong() {
    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    const song = this.playlist[randomIndex];
    return song;
  }

  play(query) {
    this.playlist = this.load(query);
    const filterPlayed = played => R.filter(song => song.id !== played.id)(this.playlist);
    const playRandomSong = () => {
      const song = this.getRandomSong();
      if (!song) return;
      this.emit('playing', song);
      song.playCount += 1;
      this.playlist = filterPlayed(song);
      setTimeout(playRandomSong, song.time * 1000);
    };
    playRandomSong();
  }

  stop() {
    this.playlist = [];
  }

  initSong({ title = '', artist = '', genre = '', album = '', time = 0, year = 1970, rating = 0 }) {
    return {
      id: (this.id += 1),
      title,
      artist,
      genre,
      album,
      time: Number(time),
      year: Number(year),
      rating: Number(rating),
      playCount: 0,
      dateAdded: new Date(),
    };
  }

  add(song) {
    const newSong = this.initSong(song);
    this.musics.push(newSong);
    this.emit('songAdded', newSong);
    return newSong;
  }
}

export default Musics;
