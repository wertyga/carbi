import { MAIN_PAIRS, SECONDARY_PAIRS } from './commonData';
import { gfCurrency } from '../goldfish';

export const formatSymbol = (symbol) => {
  let mainKey;
  const editedSymbol = symbol.toUpperCase();
  const mainCoin = MAIN_PAIRS.find(item => new RegExp(item, 'i').test(editedSymbol));
  const secondaryCoin = SECONDARY_PAIRS.find(item => new RegExp(item, 'i').test(editedSymbol));

  if (mainCoin) {
    mainKey = mainCoin;
  } else if (secondaryCoin) {
    mainKey = editedSymbol.replace(secondaryCoin, '');
  }

  const secondaryKey = editedSymbol.replace(mainKey, '');
  return `${mainKey}${gfCurrency.symbolDivider}${secondaryKey}`;
};
