import { formatSymbol } from '../helpers';

import * as api from './api';

export const getBitfinexPrices = async () => {
  try {
    const { data } = await api.fetchPrices();

    return data.reduce((init, arrItem) => {
      const symbol = arrItem[0].replace('t', '');
      if (symbol.length < 6) return init;

      const price = String(arrItem[7]);

      const editedSymbol = formatSymbol(symbol);

      return { ...init, [editedSymbol]: price };
    }, {});
  } catch (e) {
    throw e;
  }
}