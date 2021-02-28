import _flatten from 'lodash/flatten';
import _uniq from 'lodash/uniq';
import _isEmpty from 'lodash/isEmpty';
import { logger } from 'logger/logger';
import { TIMES } from '../../utils/dateHelpers';
import { legend } from '../markets/commonData';

import { savePricesToDB, comparedMarketsData, saveMarkets } from './helpers';
import { checkNotifies } from './notifiesHelpers';

const SAVE_PRICES_INTERVAL_TIME = 3000;
const SAVE_MARKETS_INTERVAL_TIME = TIMES.DAY;
const isDev = process.env.NODE_ENV !== 'production';
let interval;
let marketsInterval;
let marker;
let marketsList = {};

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
   
    const currentMarkets = {};
    const pricesResult = {};
   
    marketsData.forEach((market = {}, i) => {
      const marketName = legend[i];
      Object.entries(market).forEach(([symbol, price]) => {
        currentMarkets[marketName] = [
          ...currentMarkets[marketName] || [],
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

    const { marketsWithFilteredSymbols, filteredSymbols } = collectPairsExistAtLeastTwoMarkets(currentMarkets);
    if (_isEmpty(marketsList)) {
      await saveMarkets(marketsWithFilteredSymbols);
    }
    marketsList = marketsWithFilteredSymbols;
    const pricesToSave = Object.entries(pricesResult)
      .filter(([symbol]) => filteredSymbols.includes(symbol))
      .map(([symbol, { prices }]) => ({ symbol, prices }));

    await savePricesToDB(pricesToSave);
  } catch (e) {
    console.log(e);

    const error = `fetchMarketsData: ${e}`;
    logger(error, 'ERROR');
    intervalFetchMarketsData();
  } finally {
    marker = false;
  }
};

export async function intervalFetchMarketsData() {
  clearInterval(interval);
  interval = null;
  clearInterval(marketsInterval);
  marketsInterval = null;
  
  await fetchMarketsData();
  
  interval = setInterval(() => {
    fetchMarketsData();
  }, SAVE_PRICES_INTERVAL_TIME)
  marketsInterval = setInterval(() => {
    saveMarkets(marketsList);
  }, SAVE_MARKETS_INTERVAL_TIME)
};
