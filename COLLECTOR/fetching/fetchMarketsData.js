import _flatten from 'lodash/flatten';
import _uniq from 'lodash/uniq';

import { legend } from '../markets/commonData';

import { saveDataToDB, comparedMarketsData } from './helpers';
import { checkNotifies } from './notifiesHelpers';
import { logger } from 'logger/logger';

const INTERVAL_TIME = 3000;
const isDev = process.env.NODE_ENV !== 'production';
let interval;
let marker;

const collectPairsExistAtLeastTwoMarkets = (markets) => {
  const allMarkets = Object.keys(markets);
  const allSymbols = _uniq(_flatten(Object.values(markets)));
  const result = allSymbols.filter(symbol => {
    let includes = 0;
    allMarkets.forEach((market) => {
      if (markets[market].includes(symbol)) includes += 1;
    });

    return includes > 1;
  });

  const marketsWithFilteredSymbols = {};
  let filteredSymbols = [];

  allMarkets.forEach((market) => {
    const symbols = markets[market].filter(item => result.includes(item));
    marketsWithFilteredSymbols[market] = symbols;
    filteredSymbols = [...filteredSymbols, ...symbols];
  });

  return {
    marketsWithFilteredSymbols,
    filteredSymbols: _uniq(filteredSymbols),
  };
};

export const fetchMarketsData = async () => {
  if (marker) return;

  marker = true;
  try {
    const marketsData = await comparedMarketsData();
   
    const markets = {};
    const pricesResult = {};
   
    marketsData.forEach((market = {}, i) => {
      const marketName = legend[i];
      Object.entries(market).forEach(([symbol, price]) => {
        markets[marketName] = [
          ...markets[marketName] || [],
          symbol,
        ];
        
        if (pricesResult[symbol] && pricesResult[symbol].prices) {
          pricesResult[symbol].prices = [...pricesResult[symbol].prices, { market: marketName, price }]
        } else {
          pricesResult[symbol] = {
            prices: [{ market: marketName, price }],
          };
        }
      });
    });
    await checkNotifies(pricesResult);

    const { marketsWithFilteredSymbols, filteredSymbols } =  collectPairsExistAtLeastTwoMarkets(markets);

    const dataToSave = {
      markets: marketsWithFilteredSymbols,
      mainData: Object.entries(pricesResult)
        .filter(([symbol]) => filteredSymbols.includes(symbol))
        .map(([symbol, { prices }]) => ({ symbol, prices })),
    };

    await saveDataToDB(dataToSave);
  } catch (e) {
    if (isDev) {
      console.log(e);
    }

    const error = `fetchMarketsData: ${e}`;
    logger(error, 'ERROR');

    intervalFetchMarketsData();
  } finally {
    marker = false;
  }
};

export function intervalFetchMarketsData() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  interval = setInterval(() => {
    fetchMarketsData();
  }, INTERVAL_TIME)
};
