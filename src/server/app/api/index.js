import express from 'express';
import initMusics from './musics';

const initApi = (models) => {
  const api = express.Router();
  api.use('/musics', initMusics(models));
  return api;
};

export default initApi;
