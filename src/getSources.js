import path from 'path';
import cheerio from 'cheerio';
import loadData from './loadData';
import { makeDir, writeFile } from './fs';
import { getHostName, getFileName } from './name';

export default (html, host, dir) => {
  const $ = cheerio.load(html);

  const hostName = getHostName(host);
  const folder = `${hostName}_files`;
  const resultPath = path.resolve(dir, folder);
  const hrefReg = /^(?!http.:\/\/)/g;

  const sourceAttr = {
    link: 'href',
    img: 'src',
    script: 'src',
  };

  const sources = Object.keys(sourceAttr).reduce((acc, tagName) => {
    const promises = $(tagName)
      .filter((index, element) => {
        const attrValue = $(element).attr(sourceAttr[tagName]);
        return attrValue.match(hrefReg);
      })
      .map((index, element) => {
        const attrValue = $(element).attr(sourceAttr[tagName]);
        const fileName = getFileName(attrValue);
        $(element).attr(sourceAttr[tagName], `/${folder}/${fileName}`);
        return loadData(`${host}${path.join('/', attrValue)}`)
          .then((response) => {
            if (tagName === 'img') {
              return writeFile(resultPath, fileName, response.data.pipe, 'bin');
            }
            return writeFile(resultPath, fileName, response.data);
          });
      });
    return [...acc, promises];
  }, []);

  return makeDir(resultPath)
    .then(() =>
      Promise.all(sources))
    .then(() =>
      writeFile(dir, `${hostName}.html`, $.html()));
};
