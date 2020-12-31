import express from 'express';
import { Markets, User } from 'HTTP/models';
import { unRegisterPairs, unRegisterMarkets } from 'COLLECTOR/markets/commonData';

export const dataRoute = express.Router();

const getUnregisterData = (markets) => {
  return markets.map(item => {
    item.pairs = item.pairs.filter(symbol => unRegisterPairs.includes(symbol));
    return item;
  })
    .filter(({ market }) => unRegisterMarkets.includes(market));
};

dataRoute.get('/markets-pairs', async (req, res) => {
  try {
    const { token } = req.headers;
    const user = token && await User.findOne({ token });
    let markets = await Markets.find({});
   
    // if (!user || user.tariff < 1) {
    //   markets = getUnregisterData(markets);
    // }

    const editedData = markets.reduce((init, { market, pairs }) => ({
      ...init,
      [market]: pairs,
    }), {});
    
    res.json({ data: editedData });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});