import axios from 'axios';

const gateway = 'https://api.exmo.com';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/v1/ticker/`,
  })
);
