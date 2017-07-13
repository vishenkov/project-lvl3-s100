import fs from 'mz/fs';
import path from 'path';
import debugModule from './lib/debug';

const debug = debugModule('fs');

export const makeDir = (dir) => {
  const workDir = path.resolve(dir);
  debug(`mkdir ${workDir}`);
  return fs.mkdir(workDir)
    .catch((e) => {
      if (e.code === 'EEXIST') {
        debug(`ERROR: EEXIST ${dir}`);
        return e.code;
      }
      throw e;
    });
};

export const writeFile = (dir, filename, data = '', type = 'text') => {
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
    });
};
