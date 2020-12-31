import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getDigifinexPrices = async () => {
  try {
    const { data: { ticker } } = await api.fetchPrices();

    return ticker.reduce((init, { symbol, last }) => {
      const editedSymbol = gfCurrency.getEditedSymbol(symbol.toUpperCase());

      return { ...init, [editedSymbol]: String(last) };
    }, {});
  } catch (e) {
    throw e;
  }
}