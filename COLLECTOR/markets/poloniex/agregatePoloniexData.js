import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getPoloniexPrices = async () => {
  try {
    const { data } = await api.fetchPoloniexPrices();
    return Object.entries(data)
      .reduce((init, [key, { last }]) => {
        const [mainChar, secChar] = key.split('_');
        return { ...init, [`${secChar}${gfCurrency.symbolDivider}${mainChar}`]: last };
      }, {});
  } catch (e) {
    throw e;
  }
}