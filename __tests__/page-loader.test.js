import pageloader from '../src/';

test('hello world!', () => {
  expect(pageloader())
  .toBe(true);
});
