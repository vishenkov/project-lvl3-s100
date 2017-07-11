import nock from 'nock';
import fs from 'fs';
import mzfs from 'mz/fs';
import os from 'os';
import path from 'path';
import loadData from '../src/loadData';
import { getName, pageloader } from '../src';

const host = 'http://localhost';

test('pageloader test!', () => {
  nock(host)
    .get('/')
    .reply(200, 'test data');

  expect.assertions(1);
  return loadData(host)
    .then((data) => {
      expect(data.data).toBe('test data');
    });
});

describe('file test', () => {
  let dir = './';
  beforeEach(() => {
    dir = fs.mkdtempSync('./', (err, folder) => {
      if (err) throw err;
      return folder;
    });
  });
  test('pageloader index test!', () => {
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
  test('pageloader 404 error!', () => {
    nock(host)
      .get('/')
      .reply(404, 'Page Not Found');
    expect.assertions(1);
    return pageloader(host, dir)
      .then(e =>
        expect(e).toBeInstanceOf(Error));
  });
});
