import path from 'path';
import cheerio from 'cheerio';
import debugModule from './lib/debug';
import { getFileName } from './name';

const debug = debugModule('getSources');

export default (html, hostName, dir) => {
  const $ = cheerio.load(html);

  const folder = `${hostName}_files`;
  const resultPath = path.resolve(dir, folder);
  const hrefReg = /^(?!http.:\/\/)/g;
  debug(`files path: ${resultPath}`);

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
        const attrValue = path.join('/', $(element).attr(sourceAttr[tagName]));
        const fileName = getFileName(attrValue);
        const filePath = path.resolve(resultPath, getFileName(attrValue));
        $(element).attr(sourceAttr[tagName], `${folder}${path.sep}${fileName}`);
        if (tagName === 'img') {
          srcObjs.push({ attrValue, filePath, type: 'bin' });
        } else {
          srcObjs.push({ attrValue, filePath, type: 'text' });
        }
      });
    return [...acc, ...srcObjs];
  }, []);

  debug(`resources count: ${sources.length}`);

  return [$.html(), sources];
};
