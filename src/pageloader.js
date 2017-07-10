import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

export default host =>
  new Promise((resolve, reject) => {
    axios.defaults.host = host;
    axios.defaults.adapter = httpAdapter;
    axios.get(host)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
  });
