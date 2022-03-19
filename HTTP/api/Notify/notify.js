import express from 'express';
import { Signal } from 'HTTP/models/signal/Signal';
import { getUserMiddleware } from 'HTTP/middlewares/getUserMiddleware';
import { constructError, getError } from '../helpers';
import { gfErrorsMessages } from '../../goldfish/gfErrors';

export const notifyRoute = express.Router();
// id: string,
// 	notifyType: NotifiesUser,
// 	value: string,
notifyRoute.post('/', getUserMiddleware, async ({ body }, res) => {
	try {
		const { id, notifyType, value } = body;
		const signal = await Signal.findById(id);
		// const isUserIsOwner = signal && String(signal.owner) === id;
		if (!signal) {
			throw constructError(gfErrorsMessages.ACCESS_DENIED, 400);
		}
		
		signal.notifies.push({ notifyType, value });
		const newSignal = await signal.save();
		
		res.json({ data: { data: { _id: newSignal._id, items: newSignal.notifies } } });
	} catch (e) {
		res.status(e.status || 500).json(getError(e.message));
		res.end();
	}
});
