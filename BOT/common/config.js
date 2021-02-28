const dbName = 'carbi';

export const config = {
  getToken: (isDev) => isDev
    ? '1597670690:AAFncsYIYE9ime5wQD8SWnSgL6p5b-OuLA4' // @carbi_test_bot
    : '878195207:AAFAVpADkjuoHESqsNIlghH9S1PNbE4tCzw',
  PORT: 3003,
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
