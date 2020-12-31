import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getHotbitPrices = async () => {
  try {
    const { data: { ticker } } = await api.fetchPrices();
    return ticker.reduce((init, { symbol, last }) => {
      const editedSymbol = gfCurrency.getEditedSymbol(symbol);
      return {
        ...init,
        [editedSymbol]: last,
      };
    }, {});
  } catch (e) {
    throw e;
  }
}