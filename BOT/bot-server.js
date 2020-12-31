import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import { config } from './common/config';
import { api } from './api';

import './common/mongoose';
import './handleBot';

// Set environments
const ENVS = require('../envs/envs');
ENVS.setEnvies();

const whitelist = [process.env.HTTP_SERVER];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
};

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/api', api);

server.listen(config.PORT, err => {
  if (err) {
    return console.log(err);
  }
  console.log(`Bot server starts at :${config.PORT}`)
});