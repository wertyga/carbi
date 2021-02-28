import axios from 'axios';
import _get from 'lodash/get';
import { checkNotifySignal } from './notifiesHelpers';
import { gfCurrency } from '../goldfish';

const sendSignal = ({ telegramID, message }) => (
  axios({
    method: 'post',
    url: `${process.env.BOT_SERVER}/api/signals/send-signal`.replace(/"/g, ''),
    data: {
      telegramID,
      message,
    },
  })
);

const signalsTypes = {
  more: ({ userRequest, price, market }, symbol) => {
    const [mainChar, secChar] = symbol.split(gfCurrency.symbolDivider);
    return `'${symbol}' is more then ${userRequest} ${secChar} now!\n-${market}: ${price} ${secChar}\n`;
  },
  less: ({ userRequest, price, market }, symbol) => {
    const [mainChar, secChar] = symbol.split(gfCurrency.symbolDivider);
    return `'${symbol}' is below ${userRequest} ${secChar} now!\n-${market}: ${price} ${secChar}\n`;
  },
  difference: ({ userRequest, differencePrices }, symbol) => {
    const marketsMessage = differencePrices.reduce((init, { market, price }) => {
      const [mainChar, secChar] = symbol.split(gfCurrency.symbolDivider);
      return `${init}-${market}: ${price} ${secChar}\n`;
    }, '');

    return `Difference for pair '${symbol}' has reached ${userRequest}%.\n${marketsMessage}`;
  },
};

const getNotifiesMessage = (notifies = [], symbol) => {
  if (!notifies.length) return undefined;

  return notifies.reduce((init, { notifyType, signalData }) => (
      `${init}\n${signalsTypes[notifyType](signalData, symbol)}`
    ), `Alert!\n`);
};

export const getUserMessage = (prices, signals) => {
  try {
    const signalsWithMatch = signals
      .map(signal => checkNotifySignal(prices, signal))
      .filter(({ notifies }) => !!notifies.length);

    return signalsWithMatch.map(({_id, owner, symbol, notifies}) => {
      const notifiesForMessage = notifies.filter(({active}) => !active);

      return ({
        _id,
        owner,
        computedMessage: getNotifiesMessage(notifiesForMessage, symbol),
        notifies,
      });
    });
  } catch (e) {
    console.log(e);
  }
};

export const sendSignalMessageToUser = async (allUsersSignals) => {
  return Promise.all(
    allUsersSignals
      .filter(({ signals }) => !!signals.filter(({ computedMessage }) => !!computedMessage).length)
      .map(({ telegramID, signals }) => {
      const allSignalsMessage = signals.reduce((init, { computedMessage }) => (
        computedMessage ? `${init}${computedMessage}` : init
      ), '');

      return sendSignal({ telegramID, message: allSignalsMessage });
    })
  )
};
