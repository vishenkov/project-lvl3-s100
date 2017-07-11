import program from 'commander';
import loader from './';

export default () => {
  program
    .version('0.0.6')
    .description('Downloads all resourses of a specified page')
    .option('-o, --output [dir]', 'output directory')
    .arguments('<host>')
    .action((host) => {
      loader(host, program.output)
        .then(() => {
          console.log('Success!');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .parse(process.argv);
};
