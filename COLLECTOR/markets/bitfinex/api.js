import axios from 'axios';

const GATEWAY = 'https://api-pub.bitfinex.com/v2/tickers';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${GATEWAY}`,
    params: {
      symbols: 'ALL',
    },
  })
);
