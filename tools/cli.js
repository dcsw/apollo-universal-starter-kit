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
  .action((args, options, logger) => moduleCmd('addmodule', args, options, logger))

  .command('add-crud-list-module', 'Create a new CRUD Module with list support')
  .argument('<module>', 'Module name')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('add-crud-list-module', args, options, logger))

  .command('add-linked-crud-list-module', 'Create a new CRUD Module with list support')
  .argument('<module>', 'Module name')
  .argument('<linkedEntityName>', 'Name of the linked entity to add')
  .argument(
    '[location]',
    'Where should new module be created. [both, server, client]',
    ['both', 'server', 'client'],
    'both'
  )
  .action((args, options, logger) => moduleCmd('add-linked-crud-list-module', args, options, logger))

  .command('link-modules', 'Link 2 existing modules')
  .argument('<module>', 'Module name')
  .argument('<srcEntityName>', 'Name of the main source entity to link')
  .argument('<linkedEntityName>', 'Name of the linked entity to link')
  .action((args, options, logger) => moduleCmd('link-modules', args, options, logger))

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
