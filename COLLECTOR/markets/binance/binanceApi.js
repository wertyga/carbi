import axios from 'axios';

const endpoint  = 'https://markets.binance.com';

export const fetchBinancePairsData = (symbol) => {
  const axiosData = {
    method: 'get',
    url: `${endpoint}/api/v3/ticker/price`,
  };

  if (symbol) axiosData.params = { symbol };

  return axios(axiosData);
}