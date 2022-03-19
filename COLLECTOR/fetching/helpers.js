import { Price, Markets } from 'HTTP/models';

import { aggregateBinanceHandler } from '../markets/binance/agregateBinanceHandler';
import {
  getHotbitPrices, getPoloniexPrices, getExmoPrices,
  getOkexPrices, getHitbtcPrices, getDigifinexPrices, getHuobiPrices,
  getBitfinexPrices, getBittrexData,
} from '../markets';

const getMarkets = (markets) => (
  Object.entries(markets).map(([market, pairs]) => ({ market, pairs }))
);

export const saveMarkets = async (markets) => {
  await Promise.all(
    getMarkets(markets)
      .map(({ market, pairs }) => (
        Markets.findOneAndUpdate(
          { market },
          { $set: { pairs, market } },
          { upsert: true },
          )
    ))
  )
};

const savePrice = async (symbol, prices) => {
  await Price.findOneAndUpdate(
    { symbol },
    { $set: { prices: prices.map(({ market, price }) => ({ market, price: price })) } },
    { upsert: true });
};

export const savePricesToDB = async (pricesToSave) => {
  try {
    await Promise.all(
      pricesToSave.map(({ symbol, prices }) => {
        return savePrice(symbol, prices);
      }),
    );
  } catch (e) {
    throw e;
  }
};

export const comparedMarketsData = () => (
  Promise.all([
    aggregateBinanceHandler(),
    getExmoPrices(),
    getPoloniexPrices(),
    getHotbitPrices(),
    // getOkexPrices(),
    getHitbtcPrices(),
    getDigifinexPrices(),
    getHuobiPrices(),
    getBitfinexPrices(),
    getBittrexData(),
  ])
);
