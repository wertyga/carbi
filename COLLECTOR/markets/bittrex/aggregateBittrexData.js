import * as api from './api';
import { gfCurrency } from '../../goldfish';

export const getBittrexData = async () => {
  try {
    const { data: { result } } = await api.fetchPrices();

    return result.reduce((init, { MarketName, Last }) => {
      const editedSymbol = gfCurrency.getEditedSymbol(MarketName.toUpperCase());

      return { ...init, [editedSymbol]: String(Last) };
    }, {});
  } catch (e) {
    throw e;
  }
}