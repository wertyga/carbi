import express from 'express'

import { dataRoute } from './marketData/marketData';
import { userRoute } from './User/user';
import { signalsRoute } from './Signals/signals';

export const api = express.Router();

api.use('/data', dataRoute);
api.use('/user', userRoute);
api.use('/signals', signalsRoute);
