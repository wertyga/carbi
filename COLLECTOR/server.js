import express from 'express';
import http from 'http';
import { config } from './common/config';

import './common/mongoose';
import { intervalFetchMarketsData } from './fetching/fetchMarketsData';

const app = express();
const server = http.createServer(app);

// Set environments
const ENVS = require('envs/envs');
ENVS.setEnvies();


server.listen(config.PORT, err => {
  if (err) {
    return console.log(err);
  }
  console.log(`> Collector on http://localhost:${config.PORT}`)
});

intervalFetchMarketsData();