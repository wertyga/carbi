const app = require('express')();
const server = require('http').Server(app);
import { config } from './common/config';
const handleSocket = require('./handleSocket');

import './common/mongoose';

const io = require('socket.io')(server);
io.on("connection", handleSocket);

// Set environments
// const ENVS = require('../envs/envs');
// ENVS.setEnvies();

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", process.env.CLIENT);
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header("Access-Control-Allow-Headers",'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
//   next();
// });
// app.use(bodyParser.json());

// handleSocket(io);
// io.on('connection', socket => {
//   socket.on('get_symbols_price', async (symbols) => {
//     console.log(symbols);
//     // const prices = await Price.find({ symbol: symbols });
//     //
//     // const modifiedPrices = prices.reduce((init, { symbol, prices }) => ({
//     //   ...init,
//     //   [symbol]: prices.map(({ _doc }) => ({ ..._doc, price: _doc.price })),
//     // }), {});
//     // socket.emit('symbols_price', modifiedPrices);
//   });
//   // handleSocket(io, socket);
// });

server.listen(config.PORT, () => console.log(`IO-server start at :${config.PORT}`));
