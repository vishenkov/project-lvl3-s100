import axios from 'axios';
import nock from 'nock';
import httpAdapter from 'axios/lib/adapters/http';
import pageloader from '../src/pageloader';

const host = 'http://localhost';

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

test('pageloader test!', () => {
  nock(host)
    .get('/')
    .reply(200, 'test data');

  expect.assertions(1);
  return pageloader(host)
    .then((data) => {
      expect(data).toBe('test data');
    });
});
