const TelegramBot = require('node-telegram-bot-api');

import { comparedHandler } from './help';
import { config } from './common/config';

const isDev = process.env.NODE_ENV !== 'production';

const bot = new TelegramBot(config.getToken(isDev), { polling: true });

export const sendSignal = (telegramID, message) => {
  bot.sendMessage(telegramID, message);
};

bot.on('message', async (data) => {
  const { chat: { id: chartID }, text } = data;
  const signal = /\/signal (.+)/.test(text);

  try {
    if (signal) {
      const id = text.split(' ')[1].trim();
      const { message } = await comparedHandler('/signalID', id);
      return message && bot.sendMessage(chartID, message);
    }
    const { message } = await comparedHandler(text.trim(), data);

    message && bot.sendMessage(chartID, message);
  } catch (e) {
    bot.sendMessage(chartID, e.message);
  }
});
