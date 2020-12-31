import { mostPopularCurrency } from '../commonData';
import { gfCurrency } from '../../goldfish';

import * as api from './api';

export const getHitbtcPrices = async () => {
  try {
    const { data } = await api.fetchPrices();

    return data.reduce((init, { symbol, last }) => {
      const char = mostPopularCurrency.find((item) => symbol.indexOf(item) !== -1);
      if (!char) return init;

      const mainChar = symbol.indexOf(char) === 0 ? char : symbol.replace(char, '');
      const secChar = symbol.replace(mainChar, '');

      return { ...init, [`${mainChar}${gfCurrency.symbolDivider}${secChar}`]: last };
    }, {});
  } catch (e) {
    throw e;
  }
}