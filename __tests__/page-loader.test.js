import nock from 'nock';
import fs from 'fs';
import os from 'os';
import mzfs from 'mz/fs';
import path from 'path';
import { writeFile, makeDir } from '../src/fs';
import loadData from '../src/loadData';
import loader from '../src';
import { getHostName, getFileName } from '../src/name';

const host = 'http://localhost';
const fixturesPath = './__tests__/__fixtures__/';

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

  test('getFileName: /assets/file.main.min.js', () => {
    expect(getFileName('/assets/file.main.min.js')).toBe('assets-file-main-min.js');
  });

  test('getFileName: assets/file.main.min.js', () => {
    expect(getFileName('/assets/file.main.min.js')).toBe('assets-file-main-min.js');
  });

  test('getHostName: https://ru.hexlet.io/courses', () => {
    expect(getHostName('https://ru.hexlet.io/courses')).toBe('ru-hexlet-io-courses');
  });
});

describe('fs test', () => {
  let dir = './';
  beforeEach(() => {
    dir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  });

  test('writeFile: local empty file', () => {
    expect.assertions(1);
    return writeFile(dir, 'test.txt')
      .then(() =>
        mzfs.exists(`${dir}${path.sep}test.txt`))
      .then((exists) => {
        expect(exists).toBe(true);
      });
  });

  test('writeFile: dir/file', () => {
    expect.assertions(1);
    const localPath = `${dir}${path.sep}dir${path.sep}`;
    return writeFile(localPath, 'test', 'some data')
      .then(() =>
        mzfs.exists(`${localPath}test`))
      .then((exists) => {
        expect(exists).toBe(true);
      });
  });

  test('writeFile: write to existing file dir/file', () => {
    expect.assertions(1);
    const localPath = `${dir}${path.sep}dir${path.sep}`;
    return writeFile(localPath, 'test', 'test data')
      .then(() =>
        writeFile(localPath, 'test', 'another test data'))
      .then(() => {
        const fileData = fs.readFileSync(`${localPath}test`, 'utf8');
        expect(fileData).toBe('another test data');
      });
  });

  test('writeFile: write to dir', () => {
    expect.assertions(1);
    fs.mkdirSync(`${dir}${path.sep}dir`);
    return writeFile(`${dir}${path.sep}`, 'dir', 'some data')
      .catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
  });

  test('makeDir: os.tmp/dir/', () => {
    expect.assertions(1);
    return makeDir(`${dir}${path.sep}dir`)
      .then(() =>
        mzfs.exists(`${dir}${path.sep}dir`))
      .then((exists) => {
        expect(exists).toBe(true);
      });
  });

  test('makeDir: make existing folder os.tmp/dir/', () => {
    expect.assertions(1);
    return makeDir(`${dir}${path.sep}dir`)
      .then(() =>
        makeDir(`${dir}${path.sep}dir`)
      .then(() =>
        mzfs.exists(`${dir}${path.sep}dir`))
      .then((exists) => {
        expect(exists).toBe(true);
      }));
  });

  test('makeDir: make unexisting folder os.tmp/dir/another', () => {
    expect.assertions(1);
    return makeDir(`${dir}${path.sep}dir${path.sep}another`)
      .catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
  });

  test('makeDir: file in path os.tmp/file/dir', () => {
    expect.assertions(1);
    fs.writeFileSync(`${dir}${path.sep}file`, 'data', 'utf8');
    return makeDir(`${dir}${path.sep}file${path.sep}dir`)
      .catch((e) => {
        expect(e).toBeInstanceOf(Error);
      });
  });
});

describe('lib test', () => {
  let dir = './';
  beforeEach(() => {
    dir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
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

  test('pageloader: host 404 error', () => {
    nock(host)
      .get('/')
      .reply(404, 'Page Not Found');
    expect.assertions(1);
    return loader(host, dir)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });

  test('pageloader: host - OK, file - 404 error', () => {
    const content = '<img src="1.jpg" />';
    nock(host)
      .get('/')
      .reply(200, content)
      .get('/1.jpg')
      .reply(404);
    expect.assertions(1);
    return loader(host, dir)
      .then(() =>
        mzfs.readFile(path.join(dir, `${getHostName(host)}.html`), 'utf8'))
      .then((readData) => {
        expect(readData).toBe('<html><head></head><body><img src="localhost-_files/1.jpg"></body></html>');
      });
  });

  test('pageloader: uncorrect host', () => {
    expect.assertions(1);
    return loader('ya.ru\\', dir)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });

  test('pageloader: host 500 error', () => {
    nock(host)
      .get('/')
      .reply(500);
    expect.assertions(1);
    return loader(host, dir)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });

  test('pageloader: unexisting dir', () => {
    nock(host)
      .get('/')
      .reply(500);
    expect.assertions(1);
    return loader(host, `${dir}${path.sep}dir${path.sep}another${path.sep}`)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
      });
  });

  test('pageloader: onepage test', () => {
    const onepagePath = `${fixturesPath}onepage/`;
    nock(host)
      .get('/')
      .reply(200, fs.readFileSync(`${onepagePath}index.html`, 'utf8'))
      .get('/assets/style.css')
      .reply(200, fs.readFileSync(`${onepagePath}assets/style.css`, 'utf8'))
      .get('/js/main.js')
      .reply(200, fs.readFileSync(`${onepagePath}js/main.js`, 'utf8'))
      .get('/assets/logo.png')
      .reply(200, fs.createReadStream(`${onepagePath}assets/logo.png`));

    expect.assertions(2);

    return loader(host, dir)
      .then(([hostName, sources]) => {
        expect(hostName).toBe(getHostName(host));
        expect(sources.length).toBe(3);
      });
  });
});
