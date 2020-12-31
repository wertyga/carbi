import { mostPopularCurrency  } from '../commonData';
import { fetchBinancePairsData } from './binanceApi';
import { formatSymbol } from '../helpers';

const limitHeader = 'x-mbx-used-weight';
const attentionlimitheader = 'Retry-After';

let stopLimit = false;

const binancePairsFilter = (binanceData) => {
  return Object.entries(binanceData)
    .filter(([ key, value]) => mostPopularCurrency.find(symbol => key.indexOf(symbol) !== -1))
    .reduce((init, [key, value]) => ({ ...init, [key]: value }), {});
};

const formatData = (data) => {
  return data.reduce((init, { symbol, price }) => {
    const editedSymbol = formatSymbol(symbol);

    if (/undefined/.test(editedSymbol)) return init;

    return {
      ...init,
      [editedSymbol]: price,
    };
  }, {});
};

export const aggregateBinanceHandler = async () => {
  if (stopLimit) return [];

  try {
    const { data, headers } = await fetchBinancePairsData();

    const attention = headers[attentionlimitheader];
  
    if (attention) {
      stopLimit = true;
      setTimeout(() => {
        stopLimit = false;
      }, attention * 1000);
    }

    const collectedData = formatData(data);
    return binancePairsFilter(collectedData);
  } catch (e) {
    throw e;
  }
};