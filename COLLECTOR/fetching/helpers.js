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

const savePrice = async (symbol, prices) => {
  const price = await Price.findOne({ symbol });
  if (!price) {
    await new Price({
      symbol,
      prices: prices.map(({ market, price }) => ({ market, price: price })),
    }).save();
  } else {
    const pricesToObj = [...price._doc.prices, ...prices]
      .reduce((init, { market, price }) => ({
        ...init,
        [market]: price,
      }), {});
    price.prices = Object.entries(pricesToObj).map(([market, price]) => ({ market, price }));

    await price.save();
  }
};

export const saveDataToDB = async ({ markets, mainData }) => {
  try {
    await Promise.all([
      ...mainData.map(({ symbol, prices }) => {
        return savePrice(symbol, prices);
      }),
      ...getMarkets(markets).map(({ market, pairs }) => (
        Markets.findOneAndUpdate({ market }, { $set: { pairs, market } }, { upsert: true })
      )),
    ]);
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
    getOkexPrices(),
    getHitbtcPrices(),
    getDigifinexPrices(),
    getHuobiPrices(),
    getBitfinexPrices(),
    getBittrexData(),
  ])
);
