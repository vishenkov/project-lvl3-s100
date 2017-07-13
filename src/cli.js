import program from 'commander';
import loader from './';
import debugModule from './lib/debug';

const debug = debugModule('cli');

export default () => {
  program
    .version('0.0.6')
    .description('Downloads all resourses of a specified page')
    .option('-o, --output [dir]', 'output directory')
    .arguments('<host>')
    .action((host) => {
      loader(host, program.output)
        .then(() => {
          debug('WORK DONE!');
          console.log('Success!');
          process.exit(0);
        })
        .catch((error) => {
          debug('ERROR OCCURED');
          debug(error);
          console.error('Error: program finished with exit code 1');
          process.exit(1);
        });
    })
    .parse(process.argv);
};
