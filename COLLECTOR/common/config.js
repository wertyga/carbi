const dbName = 'carbi';

export const config = {
  PORT: 3004,
  session: {
    secret: "nodeJSForever",
    key: "sid",
    cookie: {
      name: 'session',
      keys: ['key1', 'key2'],
      maxAge: 10000
    }
  },
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
  hash: {
    secret: 'secretsalt',
    salt: 10,
  },
};
