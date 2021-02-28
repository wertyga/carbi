import _isEmpty from 'lodash/isEmpty';

export const checkRequireFields = (object) => {
	const errors = {};
	Object.entries(object).forEach(([key, value]) => {
			if (!value) errors[key] = `${key} is required`;
		});
	
	return {
		isValid: _isEmpty(errors),
		errors,
	}
};
