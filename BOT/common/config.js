const dbName = 'carbi';

export const config = {
  getToken: (isDev) => isDev ? '819809054:AAGZu7L7BDnAK8Vw8lwN-zCbF7Rd53IdNkA' : '878195207:AAFAVpADkjuoHESqsNIlghH9S1PNbE4tCzw',
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