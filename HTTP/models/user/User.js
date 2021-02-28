import crypto from 'crypto';
import mongoose from 'mongoose';
import shortID from 'short-id';
import { config } from 'HTTP/common/config';

const userSchema = new mongoose.Schema({
  username: {
      type: String,
  },
  first_name: String,
  last_name: String,
  telegramID: String,
  signals: {
      type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'signal',
      }],
      default: [],
  },
  password: {
    type: String,
  },
  token: {
      type: String,
  },
  tariff: {
    type: Number,
    default: 1,
  },
});

export const generateHash = (value) => {
  return crypto.createHmac('sha256', config.hash.secret)
    .update(value)
    .digest('hex');
};
export const generateToken = ({ username, telegramID }) => {
  return `${generateHash(username)}.${generateHash(telegramID)}.${generateHash(shortID.generate())}`;
};

userSchema.statics.clearAllPasswords = function() {
  return this.updateMany({}, { $set: { password: '' } });
};
userSchema.statics.isTokenValid = async function(token) {
  const existUser = await this.findOne({ token });
  if (!existUser) return false;

  const { username, telegramID, token: userToken } = existUser;

  const checkedToken = generateToken({ username, telegramID }).split('.').slice(0, 2).join('.');

  return checkedToken === userToken.split('.').slice(0, 2).join('.')
};
userSchema.statics.getUserWithUpdateToken = async function(opts) {
  const existUser = await this.findOne(opts);
  if (existUser) {
    existUser.token = generateToken({ username: existUser.username, telegramID: existUser.telegramID });
    return existUser.save();
  }
  
  return existUser;
};

export const User = mongoose.model('user', userSchema);
