import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getExmoPrices = async () => {
  try {
    const { data } = await api.fetchPrices();

    const result = {};
    for(let key in data) {
      const editedKey = gfCurrency.getEditedSymbol(key);
      result[editedKey] = data[key].buy_price;
    }

    return result;
  } catch (e) {
    throw e;
  }
}