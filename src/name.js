import url from 'url';
import pathModule from 'path';

const replace = text => text.replace(/\W/g, '-');

export const getHostName = (link) => {
  const { host, path } = url.parse(link);
  return replace(`${host}${path}`);
};

export const getFileName = (file) => {
  const { dir, name, ext } = pathModule.parse(file);
  const dirPath = dir.substring(1);
  const newFileName = replace(`${dirPath}${dirPath.length > 0 ? '/' : ''}${name}`);
  return `${newFileName}${ext}`;
};
