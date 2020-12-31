export const getError = (message) => {
  const errors = message instanceof Array ? message : [message];
  return {
    errors: errors.map((error) => {
      if (typeof error === 'object') return error;

      return { message: error };
    }),
  };
};

export const constructError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
