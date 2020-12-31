import _isEmpty from 'lodash/isEmpty';
import { Signal, Price, User } from 'HTTP/models';
import { getUserPass } from './user';

export const startHandler = () => {
    return `Hello, I'm Carbi - Cryptocurrency Arbitrage bot.
Use:
- /auth to get log in credentials
- /help for commands list

Our website: carbi.me
Our Twitter: twitter.com/carbitrage
`;
};

export const helpHandler = () => (`
/signals   - Get list of your saved signals
/signal id - Show current data for one of your saved signals
`);

const noSuchCommandHandler = () => 'There is no such command';

const handleSignalsData = ({ user, signal, price, signals }) => {
  if (!signal || !price) return 'There is no such signal';
  if (!user) return 'There is no such user';
  if (user.tariff < 1) return 'You have no payed subscription plan';
  if (!signals.length) return 'You have no signals';
};

const notifiesMessages = (notifies) => notifies.reduce((init, { notifyType, value }) => {
  const type = `${notifyType.charAt(0).toUpperCase()}${notifyType.slice(1)} price`;

  return `${init}   ${type}: ${value}\n`;
}, '');

const constructSignalMessage = ({ symbol, notifies, markets }, prices) => {
  const marketsMessage = markets.reduce((init, market) => {
    const { price } = prices.find(item => item.market === market) || {};
    if (!price) return init;

    return `${init}- ${market}: ${price}\n`;
  }, '');
  return `Symbol: ${symbol}\n${notifiesMessages(notifies)}\n${marketsMessage}`;
};

const constructSignalsMessage = ({ symbol, notifies, markets, _id }) => {
  return `ID: ${_id}\nSymbol: ${symbol}\n${notifiesMessages(notifies)}Markets: ${markets.join(', ')}`;
};

export const comparedHandler = async (command, data) => {
  switch (command) {
    case '/auth': {
      const message = await getUserPass(data.from);
      return { message };
    }

    case '/start': {
      return { message: startHandler() };
    }

    case '/help': {
      return { message: helpHandler() };
    }

    case '/signalID': {
      const signal = await Signal.findOne({ _id: data });
      const [price, user] = await Promise.all([
        Price.findOne({ symbol: signal.symbol }),
        User.findById(signal.owner),
      ]);

      const error = handleSignalsData({ user, signal, price, signals: [''] });
      if (error) return { message: error };

      const message = constructSignalMessage(signal, price.prices);
      return { message };
    }

    case '/signals': {
      const telegramID = data.chat.id;
      const user = await User.findOne({ telegramID }).populate('signals');

      const filteredSignals = user.signals.filter(({ notifies }) => !_isEmpty(notifies));
      const error = handleSignalsData({ user, signal: true, price: true , signals: filteredSignals });
      if (error) return { message: error };

      const signalsMessage = filteredSignals
        .reduce((init, signal) => (
          `${init}\n${constructSignalsMessage(signal)}\n`
        ), 'Here your signals:\n');

      return { message: signalsMessage };
    }

    default:
      return { message: noSuchCommandHandler() };
  }
};