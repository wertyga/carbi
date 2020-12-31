import axios from 'axios';

const gateway = 'https://api.huobi.pro';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/market/tickers`,
  })
);
