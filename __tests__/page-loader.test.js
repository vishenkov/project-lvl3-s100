import nock from 'nock';
import fs from 'fs';
import mzfs from 'mz/fs';
import rmrf from 'rimraf';
import path from 'path';
import { writeFile } from '../src/fs';
import loadData from '../src/loadData';
import loader from '../src';
import { getHostName, getFileName } from '../src/name';

const host = 'http://localhost';
const fixturesPath = './__tests__/__fixtures__/';
const tmpPath = './__tests__/__fixtures__/tmp/';

describe('inner libs test', () => {
  test('loadData: test', () => {
    nock(host)
      .get('/')
      .reply(200, 'test data');

    expect.assertions(1);
    return loadData(host)
      .then((data) => {
        expect(data.data).toBe('test data');
      });
  });

  test('writeFile: local empty file', () => {
    expect.assertions(1);
    return writeFile(tmpPath, 'test.txt')
      .then(() =>
        mzfs.exists(`${tmpPath}test.txt`))
      .then((exists) => {
        fs.unlinkSync(`${tmpPath}test.txt`);
        expect(exists).toBe(true);
      })
      .catch((e) => {
        console.log(e);
      });
  });

  test('writeFile: tmp dir/file', () => {
    expect.assertions(1);
    const localPath = `${tmpPath}dir/`;
    return writeFile(localPath, 'test')
      .then(() =>
        mzfs.exists(`${localPath}test`))
      .then((exists) => {
        fs.unlinkSync(`${localPath}test`);
        fs.rmdirSync(`${tmpPath}dir`);
        fs.rmdirSync(tmpPath);
        expect(exists).toBe(true);
      });
  });

  test('getFileName: /assets/file.main.min.js', () => {
    expect(getFileName('/assets/file.main.min.js')).toBe('assets-file-main-min.js');
  });
  test('getHostName: https://ru.hexlet.io/courses', () => {
    expect(getHostName('https://ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses');
  });
});

describe('lib test', () => {
  let dir = './';
  beforeAll(() => {
    fs.mkdirSync(tmpPath);
  });
  beforeEach(() => {
    dir = fs.mkdtempSync(tmpPath);
  });
  afterAll(() => {
    rmrf(tmpPath, () => {});
  });
  test('pageloader: index test', () => {
    nock(host)
      .get('/')
      .reply(200, '<html><head></head><body>test data</body></html>');
    expect.assertions(1);
    return loader(host, dir)
      .then(() =>
        mzfs.readFile(path.join(dir, `${getHostName(host)}.html`), 'utf8'))
      .then((readData) => {
        expect(readData.toString()).toBe('<html><head></head><body>test data</body></html>');
      });
  });
  test('pageloader: 404 error', () => {
    nock(host)
      .get('/')
      .reply(404, 'Page Not Found');
    expect.assertions(1);
    return loader(host, dir)
      .catch(error =>
        expect(error).toBeInstanceOf(Error));
  });

  test('pageloader: onepage test', () => {
    const onepagePath = `${fixturesPath}onepage/`;
    nock(host)
      .get('/')
      .reply(200, fs.readFileSync(`${onepagePath}index.html`))
      .get('/assets/style.css')
      .reply(200, fs.readFileSync(`${onepagePath}assets/style.css`))
      .get('/js/main.js')
      .reply(200, fs.readFileSync(`${onepagePath}js/main.js`))
      .get('/assets/logo.png')
      .reply(200, fs.readFileSync(`${onepagePath}assets/logo.png`));
    expect.assertions(1);
    return loader(host, dir)
      .then(() =>
        mzfs.readFile(path.join('./', dir, `${getHostName(host)}_files/js-main.js`), 'utf8'))
      .then((readData) => {
        const file = fs.readFileSync(`${onepagePath}js/main.js`, 'utf8');
        expect(readData).toBe(file);
      });
  });
});
