import axios from 'axios';

const gateway = 'https://api.hitbtc.com';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/api/2/public/ticker`,
  })
);
