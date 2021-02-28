import express from 'express';
import { Markets, Price } from 'HTTP/models';
import { FREE_USER_PAIRS, FREE_USER_MARKETS } from 'COLLECTOR/markets/commonData';
import { getUserMiddleware } from '../../middlewares/getUserMiddleware';
import { gfErrorsMessages } from '../../goldfish';

import { getError, constructError } from "../helpers";

export const dataRoute = express.Router();
dataRoute.get('/markets-pairs', getUserMiddleware, async (req, res) => {
  try {
    const { user: { isFreeUser } } = req;
    const cursorData = {};
    if (isFreeUser) {
      cursorData.market = FREE_USER_MARKETS;
    }
    const markets = await Markets.find(cursorData);
    
    const editedData = markets.reduce((init, { market, pairs }) => ({
      ...init,
      [market]: pairs.filter(pair => isFreeUser ? FREE_USER_PAIRS.includes(pair) : true),
    }), {});
    
    res.json({ data: editedData });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

dataRoute.get('/prices', getUserMiddleware, async (req, res) => {
  try {
    const { query: { pairs, markets }, user: { isFreeUser } } = req;
    if (isFreeUser) {
      const isPayablePair = pairs.find(pair => !FREE_USER_PAIRS.includes(pair));
      const isPayableMarket = markets.find(market => !FREE_USER_MARKETS.includes(market));
      if (isPayableMarket || isPayablePair) {
        throw constructError(gfErrorsMessages.NO_PAYABLE_ACCESS, 400);
      }
    }
    const currentPrices = await Price.find({ symbol: pairs });
  
    const filteredPrices = currentPrices.reduce((init, { prices, symbol }) => {
      const editedPrices = prices
        .map(({ market, price }) => markets.includes(market) && { market, price: Number(price) })
        .filter(price => !!price);
      return {
        ...init,
        [symbol]: [...(init[symbol] || []), ...editedPrices]
      };
    }, {});
  
    res.json({ data: { prices: filteredPrices } });
  } catch (e) {
    res.status(e.status || 500).json(getError(e.message));
  }
});
