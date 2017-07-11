import nock from 'nock';
import fs from 'fs';
import mzfs from 'mz/fs';
import rmrf from 'rimraf';
import path from 'path';
import writeFile from '../src/writeFile';
import loadData from '../src/loadData';
import { getName, pageloader } from '../src';

const host = 'http://localhost';
const fixturesPath = './__tests__/__fixtures__/';

describe('inner libs test', () => {
  test('loadData test', () => {
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
    return writeFile(fixturesPath, 'test')
      .then(() =>
        mzfs.exists(`${fixturesPath}test`))
      .then((exists) => {
        fs.unlinkSync(`${fixturesPath}test`);
        expect(exists).toBe(true);
      });
  });

  test('writeFile: tmp dir/file', () => {
    expect.assertions(1);
    const localPath = `${fixturesPath}dir/`;
    return writeFile(localPath, 'test')
      .then(() =>
        mzfs.exists(`${localPath}test`))
      .then((exists) => {
        fs.unlinkSync(`${localPath}test`);
        fs.rmdirSync(`${fixturesPath}dir`);
        expect(exists).toBe(true);
      });
  });
});

describe('file test', () => {
  let dir = './';
  beforeEach(() => {
    dir = fs.mkdtempSync(fixturesPath);
  });
  afterEach(() => {
    rmrf(dir, () => {});
  });
  test('pageloader index test', () => {
    nock(host)
      .get('/')
      .reply(200, 'test data');
    expect.assertions(1);
    return pageloader(host, dir)
      .then(() =>
        mzfs.readFile(path.join(dir, getName(host)), 'utf8'))
      .then((readData) => {
        expect(readData.toString()).toBe('test data');
      });
  });
  test('pageloader 404 error', () => {
    nock(host)
      .get('/')
      .reply(404, 'Page Not Found');
    expect.assertions(1);
    return pageloader(host, dir)
      .catch(error =>
        expect(error).toBeInstanceOf(Error));
  });
});
