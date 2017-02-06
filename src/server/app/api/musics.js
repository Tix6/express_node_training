import express from 'express';

const add = model => (req, res, next) => {
  try {
    const { song } = req.body;
    res.json(model.add(song));
  } catch (e) {
    next(e);
  }
};

const load = model => (req, res) => {
  res.json(model.load(req.query));
};

const play = model => (req, res, next) => {
  try {
    model.play(req.query);
    res.status(200).json();
  } catch (e) {
    next(e);
  }
};

const stop = model => (req, res) => {
  model.stop();
  res.status(200).json();
};

const initMusics = ({ musics }) => {
  const router = express.Router();
  musics.on('playing', song => console.log(`playing ${song.title}`));
  router.get('/', load(musics));
  router.post('/', add(musics));
  router.get('/play', play(musics));
  router.get('/stop', stop(musics));
  return router;
};

export default initMusics;
