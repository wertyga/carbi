const dbName = 'carbi';

export const config = {
  getToken: (isDev) => isDev
    ? '5004062627:AAFc5e64oYmGMA-5pv0FgLRgtRYoYiYUXpI' // @carbi_test_bot
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
