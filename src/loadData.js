import axios from './lib/axios';

export default (host) => {
  const lib = axios();
  return lib.get(host);
};
