import axios from 'axios';

const gateway = 'https://www.okex.com';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/api/spot/v3/instruments/ticker`,
  })
);
