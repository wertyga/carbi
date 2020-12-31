const dbName = 'carbi';

export const config = {
  PORT: 3002,
  mongoose: {
    uri: `mongodb://localhost/${dbName}`,
    options: {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    }
  },
};
