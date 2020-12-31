import shortID from 'short-id';
import { gfUser, gfTime } from 'HTTP/goldfish';

import { User } from 'HTTP/models';
import { generateToken } from 'HTTP/models/user/User';

const purgePass = (password) => {
  setTimeout(async () => {
    try {
      await User.findOneAndUpdate({ password }, { $set: { password: '' } });
    } catch (e) {
      console.log(e);
    }
  }, gfTime.fiveMinutes);
};

export const getUserPass = async (telegramData) => {
  const { id, is_bot, username } = telegramData;
  if (is_bot) {
    return {
      message: gfUser.goAway,
    };
  }
  const telegramID = String(id);
  const password = shortID.generate();
  try {
    const userData = {
      ...telegramData,
      telegramID,
      password,
      token: generateToken({ username, telegramID }),
    };

    const user = await User.findOneAndUpdate(
      { telegramID },
      { $set: userData },
      { upsert: true, new: true },
    );

    purgePass(user.password);

    return `Your password is: ${user.password}\n${gfUser.activePassTime.en}`;
  } catch (e) {
    throw e;
  }
};
