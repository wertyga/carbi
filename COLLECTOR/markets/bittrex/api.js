import axios from 'axios';

const gateway = 'https://api.bittrex.com/api/v1.1/public';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/getmarketsummaries`,
  })
);
