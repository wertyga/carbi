import express from 'express';
import shortId from 'short-id';
import _uniq from 'lodash/uniq';
import _isEmpty from 'lodash/isEmpty';
import { gfSignals } from 'HTTP/goldfish';
import { Price, User, Signal } from 'HTTP/models';

import { isBreakUser, saveNewSignal, filterNoAccess, getNotifyUpdateObj } from './helpers';
import { getError, constructError } from '../helpers';

export const signalsRoute = express.Router();

signalsRoute.post('/save-signal', async (req, res) => {
  try {
    const { headers: { token }, body: { signals } } = req;
    
    let user = token
      ? await User.findOne({ token })
      : { signals: signals.map(item => ({ ...item, _id: shortId.generate() })) };
    if (user._id && signals.length > 0) {
      const userSignals = await Promise.all(
        signals
          .filter(({ symbol }) => !user.signals.find(item => item.symbol === symbol))
          .map(({ markets, symbol }) => new Signal({ markets, symbol, owner: user._id }).save()),
      );
      user.signals = [...user.signals, ...userSignals.map(({ _id }) => _id)];
      user = await user.save();
      await User.populate(user, { path: 'signals' });
    }
    
    res.json({ data: user.signals });
  } catch (e) {
    res.status(e.status || 500).json(getError(e.message));
  }
});

// signalsRoute.post('/post-signal', async (req, res) => { // ?
//   try {
//     const { headers: { token }, body: { markets = [], symbol, notifies = [] } } = req;
//
//     if (_isEmpty(markets) || _isEmpty(symbol)) throw constructError(gfSignals.someDataEmptyError, 400);
//
//     const [user, prices] = await Promise.all([
//       token && User.findOne({ token }),
//       Price.findOne({ symbol }),
//     ]);
//
//     // if (isBreakUser(user, symbol, markets)) throw constructError(gfSignals.breakUserError, 400);
//     if (!prices) throw constructError(gfSignals.noPriceError);
//
//     const signalPrices = prices
//       .prices.map(({ market, price }) => ({ market, price }))
//       .filter(({ market }) => markets.includes(market));
//
//     const signal = await saveNewSignal(user, { symbol, markets, notifies });
//
//     res.json({ data: {
//       signal,
//       prices: {
//         [symbol]: signalPrices,
//       },
//     } });
//   } catch (e) {
//     res.status(e.status || 500).json(getError(e.message));
//   }
// });

signalsRoute.get('/user-signals', async (req, res) => {
  const { headers: { token } } = req;
  
  try {
    const user = await User.findOne({ token }).populate({ path: 'signals' });

    if (!user) throw constructError('User not found', 400);
    
    const symbols = _uniq(user.signals.map(({ symbol }) => symbol));
    const prices = await Price.find({ symbol: symbols });
    const modifiedPrices = prices.reduce((init, { symbol, prices }) => ({
      ...init,
      [symbol]: prices,
    }), {});

    const data = filterNoAccess(user, { prices: modifiedPrices, signals: user.signals });
    
    res.json({ data });
  } catch (e) {
    console.log(e)
    res.status(e.status || 500).json(getError(e.message));
  }
});

// signalsRoute.put('/put-notifies', async (req, res) => {
//   const { headers: { token }, body: { notify, chartId, symbol, markets } } = req;
//
//   try {
//     const user = await User.findOne({token});
//
//     if (!user || user.tariff < 1) throw constructError('You have no available to this functionality', 400);
//     if (!notify || !notify.value || !notify.notifyType) throw constructError('There is have no some require params', 400);
//
//     const notifyUpdated = await getNotifyUpdateObj(notify, symbol, markets);
//
//     const signal = await Signal.findByIdAndUpdate(
//       chartId,
//       { $push: { notifies: notifyUpdated } },
//       { new: true },
//     );
//
//     if (!signal) throw constructError('There is no such data', 404);
//
//     res.json({ data: signal });
//   } catch (e) {
//     res.status(e.status || 500).json(getError(e.message));
//   }
// });
//
// signalsRoute.put('/put-chart', async (req, res) => {
//   const { headers: { token }, body: { markets, symbol, _id } } = req;
//
//   try {
//     let signal = {
//       _id,
//       symbol,
//       markets,
//     };
//     if (token) {
//       let user;
//       [signal, user] = await Promise.all([
//         Signal.findByIdAndUpdate(_id, { $set: { markets, symbol } }, { new: true }),
//         User.findOne({ token }),
//       ]);
//
//       if (!user || isBreakUser(user, symbol, markets)) throw constructError(gfSignals.breakUserError, 400);
//     }
//
//     if (!signal) throw constructError('There is no such signal', 404);
//
//     const price = await Price.findOne({ symbol });
//
//     res.json({ data: { signal: signal, price: { [price.symbol]: price.prices } } });
//   } catch (e) {
//     res.status(e.status || 500).json(getError(e.message));
//   }
// });

signalsRoute.delete('/delete-signal', async (req, res) => {
  const { headers: { token }, body: { _id } } = req;

  try {
    if (!_id) throw constructError('Has no _id param', 404);

    await Promise.all([
      token && User.findOneAndUpdate({ token }, { $pull: { signals: String(_id) } }),
      token && Signal.findByIdAndDelete(_id),
    ]);

    res.json({ data: 'success' });
  } catch (e) {
    res.status(e.status || 500).json(getError(e.message));
  }
});

// signalsRoute.get('/get-signal', async (req, res) => {
//   const { headers: { token }, query: { id } } = req;
//
//   try {
//     if (!id || !token) throw constructError('Permission denided', 400);
//
//     const [user, signal] = await Promise.all([
//       User.findOne({ token }),
//       Signal.findById(id),
//     ]);
//
//     const isUserOwner = user.signals.find(signal => String(signal) === String(id));
//     if (!isUserOwner) throw constructError('Permission denided', 400);
//
//     res.json({ data: signal });
//   } catch (e) {
//     res.status(e.status || 500).json(getError(e.message));
//   }
// });

// signalsRoute.delete('/notify-delete', async (req, res) => {
//   const { headers: { token }, body: { notifyId, signalId } } = req;
//
//   try {
//     if (!token) throw constructError('Permission denided', 400);
//
//     const [user, signal] = await Promise.all([
//       User.findOne({ token }),
//       Signal.findById(signalId),
//     ]);
//
//     if (!signal) throw constructError('Signal not found', 404);
//     const isUserOwner = user.signals.find(signal => String(signal) === String(signalId));
//     if (!isUserOwner) throw constructError('Permission denided', 400);
//
//     signal.notifies = signal.notifies.filter(({ _id }) => _id != notifyId);
//     await signal.save();
//
//     res.json({ data: signal });
//   } catch (e) {
//     res.status(e.status || 500).json(getError(e.message));
//   }
// });
