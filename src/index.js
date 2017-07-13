import debugModule from './lib/debug';
import loadData from './loadData';
import getSources from './getSources';

const debug = debugModule('index');

export const pageloader = (host, dir = './') => {
  debug(`request ${host} to ${dir}`);
  return loadData(host)
    .then(response =>
      getSources(response.data, host, dir));
};

export default pageloader;
