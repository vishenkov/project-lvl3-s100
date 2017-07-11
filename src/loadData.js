import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

export default (host) => {
  axios.defaults.host = host;
  axios.defaults.adapter = httpAdapter;
  return axios.get(host);
};
