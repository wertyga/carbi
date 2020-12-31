import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import { config } from './common/config';
import { handleSocket } from './handleSocket';

import './common/mongoose';

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// Set environments
const ENVS = require('../envs/envs');
ENVS.setEnvies();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT);
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers",'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  next();
});
app.use(bodyParser.json());

server.listen(config.PORT, () => console.log(`IO-server start at :${config.PORT}`));

io.on('connection', socket => {
  handleSocket(io, socket);
});
