import pageloader from './pageloader';

const getName = host =>
  `${host.replace(/\W/g, '-')}.html`;

export default (host, dir = './') => {
  console.log(getName('ru.hexlet.io/courses'));
  console.log(dir);
  pageloader(host);
};
