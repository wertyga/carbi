import shortID from 'short-id';
import { Signal, Price } from 'HTTP/models';
import { unRegisterPairs, unRegisterMarkets } from 'COLLECTOR/markets/commonData';
import { getMinMaxPrices } from 'COLLECTOR/fetching/notifiesHelpers';
import { constructError } from '../helpers';

export const getNotifyUpdateObj = async (notify, symbol, markets) => {
  const defaultObj = { ...notify, value: parseFloat(notify.value), createdAt: new Date() };
  if (notify.notifyType === 'difference') {
    const price = await Price.findOne({ symbol });
    if (!price) throw constructError('No such price', 404);

    const { min } = getMinMaxPrices({ [symbol]: price }, symbol, markets);
    defaultObj.startPrice = min && min.price;
  }

  return defaultObj;
};

export const isBreakUser = (user, symbol, markets) => {
    if(user && user.tariff > 0) return false;
    const isBreakSymbol = !unRegisterPairs.includes(symbol);
    const isBreakMarkets = markets.find(market => !unRegisterMarkets.includes(market));

    if (isBreakMarkets || isBreakSymbol) return true;

    return false;
};

export const saveNewSignal = async (user, data) => {
    const { symbol, markets, notifies } = data;
    let signal = {
        _id: shortID.generate(),
        symbol,
        markets,
      };
      if (user) {
        signal = await new Signal({
          symbol,
          markets,
          notifies,
          owner: user._id,
        }).save();
        user.signals = [...user.signals, signal._id];
        await user.save();
      }

      return signal;
};

export const filterNoAccess = (user, { symbols = [], signals, prices }) => {
    if (user.tariff > 0) return { symbols, signals, prices };
    return {
        symbols: symbols.filter(symbol => unRegisterPairs.includes(symbol)),
        signals: signals.filter(({ symbol, markets }) => (
            unRegisterPairs.includes(symbol) || markets.find(market => !unRegisterMarkets.includes(market))
        )),
        prices,
    };
};
