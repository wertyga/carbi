import axios from 'axios';

const gateway = 'https://openapi.digifinex.com';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/v3/ticker`,
  })
);
