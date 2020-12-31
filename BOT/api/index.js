import express from 'express';
import { botSignalRoute } from './signal/signal';

export const api = express.Router();

api.use('/signals', botSignalRoute);