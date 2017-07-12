import axios from './lib/axios';

export default (uri, type = 'text') => {
  switch (type) {
    case 'bin':
      return axios({
        method: 'get',
        url: uri,
        responseType: 'stream',
      });
    default:
      return axios.get(uri);
  }
};
