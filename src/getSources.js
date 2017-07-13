import path from 'path';
import cheerio from 'cheerio';
import debugModule from './lib/debug';
import loadData from './loadData';
import { writeFile } from './fs';
import { getHostName, getFileName } from './name';

const debug = debugModule('getSources');

export default (html, host, dir) => {
  const $ = cheerio.load(html);

  const hostName = getHostName(host);
  const folder = `${hostName}_files`;
  const resultPath = path.resolve(dir, folder);
  const hrefReg = /^(?!http.:\/\/)/g;
  debug(`result path = ${resultPath}`);
  const sourceAttr = {
    link: 'href',
    img: 'src',
    script: 'src',
  };

  const sources = Object.keys(sourceAttr).reduce((acc, tagName) => {
    const srcObjs = [];
    $(tagName)
      .filter((index, element) => {
        const attrValue = $(element).attr(sourceAttr[tagName]);
        return attrValue ? attrValue.match(hrefReg) : false;
      })
      .each((index, element) => {
        const attrValue = $(element).attr(sourceAttr[tagName]);
        const fileName = getFileName(attrValue);
        $(element).attr(sourceAttr[tagName], `/${folder}/${fileName}`);
        if (tagName === 'img') {
          srcObjs.push({ attrValue, fileName, type: 'bin' });
        }
        srcObjs.push({ attrValue, fileName, type: 'text' });
      });
    return [...acc, ...srcObjs];
  }, []);
  debug(`resources count = ${sources.length}`);

  return writeFile(dir, `${hostName}.html`, $.html())
    .then(() =>
      Promise.all(sources.map(data =>
        loadData(`${host}${path.join('/', data.attrValue)}`, data.type)
          .then(response =>
            writeFile(resultPath, data.fileName, response.data, data.type))
          .catch((e) => {
            debug(`Error catch: ${e.response}`);
            return e.response;
          }))));
};
