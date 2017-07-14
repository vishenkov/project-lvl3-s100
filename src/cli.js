import program from 'commander';
import path from 'path';
import Listr from 'listr';
import loader from './';
import pkgjson from '../package.json';
import debugModule from './lib/debug';
import loadData from './loadData';
import { writeFile } from './fs';

const debug = debugModule('cli');

export default () => {
  program
    .version(pkgjson.version)
    .description('Downloads all resourses of a specified page')
    .option('-o, --output [dir]', 'output directory')
    .arguments('<host>')
    .action((host) => {
      loader(host, program.output)
        .then(([hostName, sources]) => {
          debug(`got response: ${hostName} ${sources.length}`);
          const tasks = sources.map(source =>
            new Listr([{
              title: `${host}${source.attrValue}`,
              task: () => {
                const link = `${host}${source.attrValue}`;
                const { dir, base } = path.parse(source.filePath);
                debug(`${dir} ${base}`);
                return loadData(link, source.type)
                  .then(response =>
                    writeFile(dir, base, response.data, source.type))
                  .catch((e) => {
                    debug(e);
                    throw new Error(e);
                  });
              },
            }]).run()
              .catch((e) => {
                debug(e);
                return null;
              }));
          return Promise.all(tasks)
            .then(() => {
              console.log(`Page was downloaded as '${hostName}.html'`);
            });
        })
        .then(() => {
          process.exit(0);
        })
        .catch((error) => {
          debug('ERROR OCCURED');
          debug(error);
          console.error(error);
          console.error('Error: program finished with exit code 1');
          process.exit(1);
        });
    })
    .parse(process.argv);
};
