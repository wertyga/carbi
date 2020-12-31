import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getOkexPrices = async () => {
  try {
    const { data } = await api.fetchPrices();

    return data.reduce((init, { instrument_id, last }) => {
      const symbol = gfCurrency.getEditedSymbol(instrument_id);
      return { ...init, [symbol]: last };
    }, {});
  } catch (e) {
    throw e;
  }
}