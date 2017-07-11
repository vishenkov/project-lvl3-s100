import program from 'commander';
import pageloader from './';

export default () => {
  program
    .version('0.0.1')
    .description('Downloads all resourses of a specified page')
    .option('-o, --output [dir]', 'output directory')
    .arguments('<host>')
    .action((host) => {
      console.log(pageloader(host, program.output));
    })
    .parse(process.argv);
};
