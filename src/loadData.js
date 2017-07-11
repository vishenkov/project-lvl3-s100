import axios from './lib/axios';

export default (host) => {
  const lib = axios();
  lib.defaults.host = host;
  return lib.get(host);
};
