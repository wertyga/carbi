const isProd = process.env.NODE_ENV === 'production';
const ip = '142.93.33.129';

const ENVIES_DEFAULTS = {
  dev: {
    CLIENT: 'http://localhost:3000',
    HTTP_SERVER: 'http://localhost:3001',
    BOT_SERVER: 'http://localhost:3003',
    IO_SERVER: 'http://localhost:3002',
    API: 'http://localhost:3001/api',
    GA_KEY: 'UA-156923036-1',
  },
  prod: {
    CLIENT: 'https://carbi.me',
    HTTP_SERVER: 'https://api.carbi.me',
    BOT_SERVER: `http://${ip}:3003`,
    IO_SERVER: 'https://sock.carbi.me',
    API: 'https://api.carbi.me/api',
    GA_KEY: 'UA-156923036-1',
  },
}

const getEnvies = () => {
  let envObject = {};
  const targetDefaults = isProd ? 'prod' : 'dev';
  Object.entries(ENVIES_DEFAULTS[targetDefaults]).forEach(([envName, envValue]) => {
    if (!!process.env[envName]) {

      envObject = { ...envObject, [envName]: JSON.stringify(process.env[envName]) };
      return;
    }
    envObject = { ...envObject, [envName]: JSON.stringify(envValue )};
    return;
  });
  return envObject;
};

const setEnvies = () => {
  Object.entries(getEnvies()).forEach(([env, value]) => {
    process.env[env] = value;
  })
}

module.exports = {
  getEnvies,
  setEnvies,
};
