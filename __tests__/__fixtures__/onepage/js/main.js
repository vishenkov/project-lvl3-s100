import fs from 'mz/fs';
import path from 'path';

export const makeDir = (dir) => {
  const workDir = path.resolve(dir);
  return fs.exists(workDir)
    .then((exists) => {
      if (!exists) {
        return fs.mkdir(workDir);
      }
      return this;
    });
};

export const writeFile = (dir, filename, data = '', type = 'text') => {
  const workDir = path.resolve(dir);
  return makeDir(workDir)
    .then(() => {
      const filepath = path.join(workDir, filename);
      switch (type) {
        case 'bin':
          return fs.createWriteStream(filepath, data);
        default:
          return fs.writeFile(filepath, data, 'utf8');
      }
    });
};
