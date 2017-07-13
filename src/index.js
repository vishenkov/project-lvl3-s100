import debugModule from './lib/debug';
import loadData from './loadData';
import getSources from './getSources';

const debug = debugModule('index');

export const pageloader = (host, dir = './') => {
  debug(`request ${host} to ${dir}`);
  return loadData(host)
    .catch((e) => {
      const statusText = e.response.statusText ? `${e.response.statusText} ` : '';
      const text = `Error: ${e.response.status} ${statusText}${e.response.config.url}`;
      debug(text);
      console.error(text);
      console.error(`Can't reach ${host} :(\nPlease, check host name and your internet connection`);
      throw new Error(e);
    })
    .then(response =>
      getSources(response.data, host, dir));
};

export default pageloader;
