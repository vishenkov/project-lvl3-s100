import fs from 'mz/fs';
import path from 'path';

export const makeDir = (dir) => {
  const workDir = path.resolve(dir);
  return fs.mkdir(workDir)
    .catch((e) => {
      if (e.code === 'EEXIST') {
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
          return data.pipe(fs.createWriteStream(filepath));
        default:
          return fs.writeFile(filepath, data, 'utf8');
      }
    });
};
