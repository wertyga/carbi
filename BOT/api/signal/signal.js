import express from 'express';
import { sendSignal } from '../../handleBot';

export const botSignalRoute = express.Router();

botSignalRoute.post('/send-signal', async (req, res) => {
  const { body: { telegramID, message } } = req;
  await sendSignal(telegramID, message);

  res.json('success');
});
