import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import logger from 'morgan';
import initApi from './api/';
import middlewares from '../app/middlewares/';

const getUrl = server => `http://${server.address().address}:${server.address().port}`;

const initApp = ({ config, models } = {}) => {
  const { server: { back: { host, port } } } = config;
  const app = express();
  const httpServer = http.createServer(app);

  const promise = new Promise((resolve) => {
    app.disable('etag')
      .use(bodyParser.json())
      .use(logger('dev'))
      .use('/ping', (req, res) => res.json({ ping: 'pong' }))
      .use('/api/v1', initApi(models))
      .use(middlewares.error);

    httpServer.listen(port, host, () => {
      app.config = config;
      app.url = getUrl(httpServer);
      resolve(app);
    });
  });

  return promise;
};

export default initApp;
