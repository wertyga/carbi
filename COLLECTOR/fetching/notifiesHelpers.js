import { User, Signal } from 'HTTP/models';

import { getUserMessage, sendSignalMessageToUser } from './messageHelpers';
import { handleLess, handleMore, handleDifference } from './checkHelpers';
import { logger } from 'logger/logger';

export const getMinMaxPrices = (allPrices, symbol, markets) => {
  const { prices } = allPrices[symbol] || {};
  if (!prices) return { min: null, max: null };

  const filteredPrices = prices
    .filter(({ market }) => markets.includes(market))
    .map(item => ({ ...item, price: parseFloat(item.price) }))
    .sort((a, b) => a.price > b.price ? 1 : -1);

  return { min: filteredPrices[0], max: filteredPrices[filteredPrices.length - 1], allPrices: filteredPrices };
};

export const checkNotifySignal = (prices, signal) => {
  const { notifies, markets, symbol } = signal;
  const { min, max, allPrices } = getMinMaxPrices(prices, symbol, markets);
  if (!min || !max) return [];

  const activeNotifies = notifies
    .map((item) => {
      const { notifyType } = item;
      let signalData;

      if (notifyType === 'more')  signalData = handleMore(item, allPrices);
      if (notifyType === 'less')  signalData = handleLess(item, allPrices);
      if (notifyType === 'difference')  signalData = handleDifference(item, allPrices, min, max);

      return { ...item._doc, signalData, active: (signalData || {}).active };
    })
    .filter(({ signalData }) => !!signalData);

  return { ...signal._doc, notifies: activeNotifies };
};

export const handleNotifiesAfterNotify = async (allUsersSignals) => {
  try {
    const signalsForUpdate = [];
    let notifiesForUpdate = [];

    allUsersSignals.forEach(({ signals }) => signals.forEach(({ _id, notifies }) => {
      const truncateNotifies = notifies.map(({ _id, active }) => ({ _id, active }));

      signalsForUpdate.push(_id);
      notifiesForUpdate = [...notifiesForUpdate, ...truncateNotifies];
    }));

    const findedSignals = await Signal.find({ _id: signalsForUpdate });

    await Promise.all(
      findedSignals.map((signal) => {
        signal.notifies = signal.notifies.map((notify) => {
          const existNotify = notifiesForUpdate.find(({ _id }) => String(_id) === String(notify._id));
          if (existNotify) return { ...notify._doc, ...existNotify };
          return notify;
        });

        return signal.save();
      })
    );
  } catch (e) {
    console.log(e)
  }
};

export const checkNotifies = async (prices) => {
  const users = await User.find({ tariff: { $gt: 0 }, signals: { $not: { $size: 0 } } }).populate('signals');
  if (!users.length) return;

  try {
    if (!users.length) return;

    const allUsersSignals = users
      .filter(({ signals }) => !!signals.length)
      .map(({ signals, telegramID }) => {
        const usersMessageSignal = getUserMessage(prices, signals);

        return { telegramID, signals: usersMessageSignal };
      });

    await sendSignalMessageToUser(allUsersSignals);

    await handleNotifiesAfterNotify(allUsersSignals);
  } catch (e) {
    const error = `sendSignal: ${e}`;
    logger(error, 'ERROR');
  }
};