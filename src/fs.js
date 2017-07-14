import fs from 'mz/fs';
import path from 'path';
import debugModule from './lib/debug';

const debug = debugModule('fs');

export const makeDir = (dir) => {
  const workDir = path.resolve(dir);
  debug(`mkdir ${workDir}`);
  return fs.mkdir(workDir)
    .catch((e) => {
      switch (e.code) {
        case 'EEXIST':
          debug(`ERROR: EEXIST ${dir}`);
          return e.code;
        case 'ENOENT':
          debug(`ERROR: ENOENT ${dir}`);
          throw new Error(`ENOENT: no such directory ${e.path}`);
        case 'EACCES':
          debug(`ERROR: EACCES ${dir}`);
          throw new Error(`EACCES: permission denied ${e.path}`);
        default:
          debug(`ERROR: ${e.code} ${e.path}`);
          throw new Error(e);
      }
    });
};

export const writeFile = (dir, filename, data = '', type = 'text') => {
  debug(`request to write ${dir} ${filename}`);
  const workDir = path.resolve(dir);
  return makeDir(workDir)
    .then(() => {
      const filepath = path.join(workDir, filename);
      switch (type) {
        case 'bin':
          debug(`writeStream:bin: ${filepath}`);
          return data.pipe(fs.createWriteStream(filepath));
        default:
          debug(`writeFile: ${filepath}`);
          return fs.writeFile(filepath, data, 'utf8');
      }
    })
    .catch((e) => {
      switch (e.code) {
        default:
          debug(`ERROR: ${e}`);
          throw new Error(e);
      }
    });
};
