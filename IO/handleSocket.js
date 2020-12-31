import { Price } from 'HTTP/models';

const TIMER = 3000;

const clearTimer = (name, timers) => {
  if (name === 'all') {
    for(let key in timers) {
      clearInterval(timers[key]);
      clearTimeout(timers[key]);
      timers[key] = null;
    }
  } else {
    clearInterval(timers[name]);
    timers[name] = null;
  }
};

export const handleSocket = (io, socket) => {
  const timers = {};

  socket.on('fetch-signal-prices', async symbols => {
    if (timers.signalPrices) clearTimer('signalPrices', timers);
    if (!symbols || !symbols.length) return clearTimer('signalPrices', timers);
    
    timers.signalPrices = setInterval(async () => {
      try {
        const prices = await Price.find({ symbol: symbols });
        if (!prices.length) clearTimer('signalPrices', timers);
        const modifiedPrices = prices.reduce((init, { symbol, prices }) => ({
          ...init,
          [symbol]: prices.map(({ _doc }) => ({ ..._doc, price: _doc.price })),
        }), {});

        socket.emit('signal-prices', modifiedPrices);
      } catch (e) {
        socket.emit('signal-prices-error', e.message);
        clearTimer('signalPrices', timers);
      }
    }, TIMER);
  });

  socket.on('stop-fetch-prices', () => {
    clearTimer('signalPrices', timers);
  });

  socket.on('disconnect', () => {
    clearTimer('all', timers);
  });
};
