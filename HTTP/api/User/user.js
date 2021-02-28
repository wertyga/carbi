import express from 'express';
import { gfUser } from 'HTTP/goldfish/index';
import { User } from '../../models/index';
import { getError } from '../helpers';

export const userRoute = express.Router();

userRoute.post('/sign-in', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      const error = new Error(gfUser.enterRequireFields.en);
      error.status = 404;
      throw error;
    }

    const user = await User.findOne({ password }).populate({ path: 'signals' });

    if (!user) {
      const error = new Error(gfUser.accessDenided.en);
      error.status = 404;
      throw error;
    }

    // const { username: userName, first_name, last_name, token, tariff } = user;
    // const sendData = {
    //   username: userName,
    //   first_name,
    //   last_name,
    //   token,
    //   tariff,
    // };
    user.password = '';
    await user.save();

    res.json({ data: user });
  } catch (e) {
    const error = getError(e.message);
    res.status(e.status || 500).json(error);
  }
});

userRoute.get('/', async ({ query: { token: userToken } , res }) => {
  if (!userToken) {
    res.status(404).json(getError(gfUser.noToken.en));
    return;
  }

  const user = await User.findOne({ token: userToken }).populate({ path: 'signals' });

  if (!user) {
    res.status(404).json(getError(gfUser.noUser.en));
    return;
  }
  const { first_name, last_name, username, token, signals, tariff } = user;
  res.json({ data: { first_name, last_name, username, token, signals, tariff } })
});
