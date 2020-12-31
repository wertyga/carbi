import axios from 'axios';

const gateway = 'https://poloniex.com/public';

export const fetchPoloniexPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}?command=returnTicker`,
  })
);
