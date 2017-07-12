import fs from 'mz/fs';
import path from 'path';

export default (dir) => {
  const workDir = path.resolve(dir);
  return fs.exists(workDir)
    .then((exists) => {
      if (!exists) {
        return fs.mkdir(workDir);
      }
      return this;
    });
};
