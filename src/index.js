import pageloader from '../src/pageloader';

const getName = host =>
  `${host.replace(/\W/g, '-')}.html`;

export default (host, dir = './') => {
  console.log(getName('ru.hexlet.io/courses'));
  pageloader(host);
};
