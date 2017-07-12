import loadData from './loadData';
import getSources from './getSources';

export const pageloader = (host, dir = './') =>
  loadData(host)
    .then(response =>
      getSources(response.data, host, dir));

export default pageloader;
