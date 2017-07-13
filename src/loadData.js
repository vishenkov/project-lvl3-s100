import axios from './lib/axios';
import debugModule from './lib/debug';

const debug = debugModule('loadData');

export default (uri, type = 'text') => {
  switch (type) {
    case 'bin':
      debug(`request for bin: ${uri}`);
      return axios({
        method: 'get',
        url: uri,
        responseType: 'stream',
      });
    default:
      debug(`request: ${uri}`);
      return axios.get(uri);
  }
};
