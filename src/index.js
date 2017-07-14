import debugModule from './lib/debug';
import loadData from './loadData';
import getSources from './getSources';
import { writeFile } from './fs';
import { getHostName } from './name';

const debug = debugModule('index');

export const pageloader = (host, dir = './') => {
  const hostName = getHostName(host);
  debug(`requested: ${host} to ${dir}`);

  return loadData(host)
    .catch((e) => {
      debug(e);
      throw new Error(e);
    })
    .then(response =>
      getSources(response.data, hostName, dir))
    .then(([html, sources]) => {
      debug('get parsed html and sources list');
      return writeFile(dir, `${hostName}.html`, html)
        .then(() => [hostName, sources]);
    });
};

export default pageloader;
