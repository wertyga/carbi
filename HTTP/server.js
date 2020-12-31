import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { config } from './common/config';

import { api } from './api';

import './common/mongoose';

const whitelist = [
  'http://localhost:3000',
  'http://142.93.33.129:3000',
  'http://carbi.me',
  'https://carbi.me',
  'https://www.carbi.me',
  'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin || /142\.93\.33\.129/.test(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};
const app = express();
const server = http.createServer(app);

// Set environments
const ENVS = require('envs/envs');
ENVS.setEnvies();

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api', api);

server.listen(config.PORT, err => {
  if (err) {
    return console.log(err);
  }
  console.log(`> Ready on http://localhost:${config.PORT}`)
});