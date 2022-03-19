import { User } from 'HTTP/models';

export const getUserMiddleware = async (req, res, next) => {
	const { token } = req.headers;
	const user = token && await User.findOne({ token });
	req.user = {
		...user,
		isFreeUser: false,
		// isFreeUser: !user || user.tariff < 1,
	};
	next();
};
