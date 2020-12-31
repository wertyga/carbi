import axios from 'axios';

const gateway = 'https://api.hotbit.io/api/v1';

export const fetchPrices = () => (
  axios({
    method: 'get',
    url: `${gateway}/allticker`,
  })
);
