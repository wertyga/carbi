import { mostPopularCurrency } from '../commonData';
import { gfCurrency } from '../../goldfish';

import * as api from './api';

export const getHuobiPrices = async () => {
  try {
    const { data: { data } } = await api.fetchPrices();

    return data.reduce((init, { symbol, close }) => {
      const editedSymbol = symbol.toUpperCase();
      const char = mostPopularCurrency.find((item) => editedSymbol.indexOf(item) !== -1);
      if (!char) return init;

      const mainChar = editedSymbol.indexOf(char) === 0 ? char : editedSymbol.replace(char, '');
      const secChar = editedSymbol.replace(mainChar, '');

      return { ...init, [`${mainChar}${gfCurrency.symbolDivider}${secChar}`]: String(close) };
    }, {});
  } catch (e) {
    throw e;
  }
}