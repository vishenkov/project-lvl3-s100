import url from 'url';
import loadData from './loadData';
import writeFile from './writeFile';

export const getName = (link) => {
  const { host, path } = url.parse(link);
  return `${`${host + path}`.replace(/\W/g, '-')}.html`;
};

export const pageloader = (host, dir = './') =>
  loadData(host)
    .then(response =>
      writeFile(dir, getName(host), response.data))
    .catch(error =>
      new Error(error));

export default pageloader;
