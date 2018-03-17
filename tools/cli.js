const prog = require('caporal');
const moduleCmd = require('./cli/module');

prog
  .version('1.0.0')
  .command('addmodule', 'Create a new Module')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .option('--seed-count <num>', 'How many seed records should be created', prog.INTEGER, 20)
  .option(
    '--no-seed-count <boolean>',
    'Defer setting seed counts -- requires subsequent use of set-seed-counts CLI command.',
    prog.BOOL,
    false
  )
  .action((args, options, logger) => {
    console.log(`${args} - ${JSON.stringify(options)}`);
    moduleCmd('addmodule', args, options, logger);
  })

  .command('link-modules', 'Link to existing modules')
  .argument('<srcEntityName>', 'Name of the main source entity to link')
  .argument('<linkedEntityName>', 'Name of the linked entity to link')
  .argument(
    '[type]',
    'Where should new module be created. [many-to-many, one-way]',
    ['many-to-many', 'one-way'],
    'many-to-many'
  )
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .option('--seed-count <num>', 'How many seed records should be created', prog.INTEGER, 20)
  .option('--linked-seed-count <num>', 'How many linked seed records should be created', prog.INTEGER, 2)
  .option(
    '--no-seed-count <boolean>',
    'Defer setting seed counts -- requires subsequent use of set-seed-counts CLI command.',
    prog.BOOL,
    false
  )
  .action((args, options, logger) => moduleCmd('link-modules', args, options, logger))

  .command('set-seed-counts', 'Set seed counts -- to be after previous --no-seed-count in CLI commands.')
  .argument('[src-modules...]', 'Which link source (master) modules to set seed counts for.')
  .option('--seed-count <num>', 'How many seed records should be created', prog.INTEGER, 20)
  .option('--linked-seed-count <num>', 'How many linked seed records should be created', prog.INTEGER, 2)
  .action((args, options, logger) => moduleCmd('set-seed-counts', args, options, logger))

  .command('deletemodule', 'Delete a Module')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('deletemodule', args, options, logger));

prog.parse(process.argv);
