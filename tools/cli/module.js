const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function copyfixFileNames(logger, srcEntityName, files, destinationPath) {
  // copy files
  shell.cp('-R', files, destinationPath);
  logger.info(`✔ The ${files} files have been copied to ${destinationPath}!`);

  // change to destination directory & rename files
  fixFileNames(destinationPath, srcEntityName, makeArraySpec(srcEntityName, null));
}

function makeArraySpec(srcEntityName, linkedEntityName) {
  return [
    { name: 'xxxx', newName: srcEntityName },
    { name: 'Xxxx', newName: srcEntityName.capitalize() },
    { name: 'XXXX', newName: srcEntityName.toUpperCase() },
    { name: 'yyyy', newName: !linkedEntityName ? null : linkedEntityName },
    { name: 'Yyyy', newName: !linkedEntityName ? null : linkedEntityName.capitalize() },
    { name: 'YYYY', newName: !linkedEntityName ? null : linkedEntityName.toUpperCase() }
  ];
}

function fixFileNames(destinationPath, srcEntityName, arraySpec) {
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      arraySpec.forEach(e => {
        if (!!e.newName && entry.name.indexOf(e.name) >= 0) {
          const moduleFile = entry.name.replace(e.name, e.newName);
          shell.mv(`${destinationPath}/${entry.name}`, `${destinationPath}/${moduleFile}`);
        }
      });
    }
  });
}

function copyModuleFiles(logger, module, templatePath, location) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  console.log(`${__dirname}/../../src/${location}/${module}`);
  const mkdir = shell.mkdir(`${__dirname}/../../src/${location}/${module}`);

  // continue only if directory does not yet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../src/${location}/${module}`;
    copyfixFileNames(logger, module, `${templatePath}/${location}/*`, destinationPath);

    // get module input data
    const path = `${__dirname}/../../src/${location}/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);

    // prepend import module
    const prepend = `import ${module} from './${module}';\n`;
    fs.writeFileSync(path, prepend + data);

    // add module to Feature function
    shell.sed('-i', re, `Feature(${module}, ${match[1]})`, path);

    logger.info(`✔ Module for ${location} successfully created!`);
  }
}

function templateAlterFile(logger, srcEntityName, linkedEntityName, filePath) {
  // Read templates out of file
  let contents = fs.readFileSync(filePath).toString();
  let templates = {};
  let templateId = '';
  contents.split('\n').forEach(l => {
    let matchTemplateStart = l.match(/(\/\/|#)\sSTART-LINKED-MODULE-TEMPLATE-(.+)/);
    if (matchTemplateStart) {
      templateId = matchTemplateStart[2];
    } else {
      if (templateId) {
        let matchTemplateEnd = l.match(/(\/\/|#)\sEND-LINKED-MODULE-TEMPLATE-(.+)/);
        if (matchTemplateEnd) templateId = '';
        if (templateId) {
          if (!templates[templateId]) templates[templateId] = '';
          let m = l.match(/^(.*)(\/\/\s|#)(.*)/);
          if (m) templates[templateId] += `${m[1]}${m[3]}\n`;
        }
      }
    }
  });
  // Make template-substituted output
  let contentOut = '';
  contents.split('\n').forEach(l => {
    contentOut += `${l}\n`;
    let matchTemplateTarget = l.match(/(\/\/|#)\sTARGET-LINKED-MODULE-TEMPLATE-(.+)/);
    if (matchTemplateTarget) {
      contentOut += `${templates[matchTemplateTarget[2]]}\n`;
    }
  });
  // Rewrite file w/template-substituted content
  fs.writeFileSync(filePath, contentOut);
}

function templateAlterFiles(logger, srcEntityName, linkedEntityName, destinationPath) {
  logger.info(`Template substituting ${destinationPath} files…`);
  // template-substitute values
  shell.ls('-Rl', destinationPath).forEach(entry => {
    let filePath = path.join(destinationPath, entry.name);
    if (entry.isFile()) {
      templateAlterFile(logger, srcEntityName, linkedEntityName, filePath);
    }
  });
}

function fixFileContents(logger, filePath, arraySpec) {
  let contentOut = '';
  // Read templates out of file
  let contents = fs.readFileSync(filePath).toString();
  let templateId = '';
  contents.split('\n').forEach(l => {
    let matchTemplateStart = l.match(/(\/\/|#)\sSTART-LINKED-MODULE-TEMPLATE-(.+)/);
    if (matchTemplateStart) {
      templateId = matchTemplateStart[2];
    } else {
      if (templateId) {
        let matchTemplateEnd = l.match(/(\/\/|#)\sEND-LINKED-MODULE-TEMPLATE-(.+)/);
        if (matchTemplateEnd) templateId = '';
      }
      if (!templateId) {
        arraySpec.forEach(e => {
          let re = new RegExp(e.name, 'g');
          l = l.replace(re, e.newName);
        });
      }
    }
    contentOut += `${l}\n`;
  });
  // Rewrite file w/template-substituted content
  fs.writeFileSync(filePath, contentOut);
}

function fixDirFileContents(logger, destinationPath, arraySpec) {
  logger.info(`Substituting non-templated areas in ${destinationPath} files…`);
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      let filePath = path.join(destinationPath, entry.name);
      fixFileContents(logger, filePath, arraySpec);
    }
  });
}

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  const modulePath = `${__dirname}/../../src/${location}/${module}`;

  if (fs.existsSync(modulePath)) {
    // create new module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${__dirname}/../../src/${location}/`);

    // add module to Feature function
    // get module input data
    const path = `${__dirname}/../../src/${location}/index.js`;
    let data = fs.readFileSync(path);

    // extract Feature modules
    const re = /Feature\(([^()]+)\)/g;
    const match = re.exec(data);
    if (match) {
      const modules = match[1].split(',').filter(featureModule => featureModule.trim() !== module);

      // remove import module line
      const lines = data
        .toString()
        .split('\n')
        .filter(line => line.match(`import ${module} from './${module}';`) === null);
      fs.writeFileSync(path, lines.join('\n'));

      // remove module from Feature function
      shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');
    }

    // continue only if directory does not jet exist
    logger.info(`✔ Module for ${location} successfully deleted!`);
  } else {
    logger.info(`✔ Module ${location} location for ${modulePath} wasn't found!`);
  }
}

module.exports = (action, args, options, logger) => {
  let templatePath = '';
  switch (action) {
    case 'add-crud-list-module':
      templatePath = `${__dirname}/../crud-list-templates/module`;
      break;
    case 'link-modules':
      templatePath = `${__dirname}/../link-modules-templates/module`;
      break;
    case 'add-linked-crud-list-module':
      templatePath = `${__dirname}/../linked-crud-list-templates/module`;
      break;
    default:
      templatePath = `${__dirname}/../templates/module`;
      break;
  }

  if (!fs.existsSync(templatePath)) {
    logger.error(`The requested location for ${args.location} wasn't found.`);
    process.exit(1);
  }

  // client
  if (args.location === 'client' || args.location === 'both') {
    switch (action) {
      case 'addmodule':
      case 'add-crud-list-module':
      case 'add-linked-crud-list-module':
        copyModuleFiles(logger, args.module, templatePath, 'client/modules');
        fixDirFileContents(
          logger,
          `${__dirname}/../../src/client/modules/${args.module}`,
          makeArraySpec(args.module, null)
        );
        break;
      case 'deletemodule':
        deleteFiles(logger, templatePath, args.module, 'client/modules');
        break;
    }
  }

  // server
  if (args.location === 'server' || args.location === 'both') {
    switch (action) {
      case 'addmodule':
      case 'add-crud-list-module':
      case 'add-linked-crud-list-module':
        copyModuleFiles(logger, args.module, templatePath, 'server/modules');
        fixDirFileContents(
          logger,
          `${__dirname}/../../src/server/modules/${args.module}`,
          makeArraySpec(args.module, null)
        );
        if (fs.existsSync(`${templatePath}/server/database`)) {
          copyfixFileNames(
            logger,
            args.module,
            `${templatePath}/server/database/*`,
            `${__dirname}/../../src/server/database`
          );
          fixDirFileContents(
            logger,
            `${__dirname}/../../src/server/database/migrations/`,
            makeArraySpec(args.module, null)
          );
          fixDirFileContents(logger, `${__dirname}/../../src/server/database/seeds/`, makeArraySpec(args.module, null));
        }
        break;
      case 'link-modules':
        // Add files to client module
        copyfixFileNames(
          logger,
          args.srcEntityName,
          path.join(templatePath, 'client/modules/*'),
          path.join(__dirname, '../../src/client/modules', args.srcEntityName)
        );
        fixFileNames(path.join(__dirname, '../../src/client/modules', args.srcEntityName), args.linkedEntityName, [
          { name: 'yyyy', newName: args.linkedEntityName },
          { name: 'Yyyy', newName: args.linkedEntityName.capitalize() },
          { name: 'YYYY', newName: args.linkedEntityName.toUpperCase() }
        ]);

        // Alter client GUI to include linked modules
        templateAlterFiles(
          logger,
          args.srcEntityName,
          args.linkedEntityName,
          path.join(__dirname, '../../src/client/modules', args.srcEntityName)
        );
        // Alter server files to include linked modules
        templateAlterFiles(
          logger,
          args.srcEntityName,
          args.linkedEntityName,
          path.join(__dirname, '../../src/server/modules', args.srcEntityName)
        );
        // Alter individual files under database to include linked modules
        logger.info(`Template substituting ${path.join(__dirname, '../../src/server/database/')}... files…`);
        templateAlterFile(
          logger,
          args.srcEntityName,
          args.linkedEntityName,
          `${__dirname}/../../src/server/database/migrations/003_${args.srcEntityName}.js`
        );
        templateAlterFile(
          logger,
          args.srcEntityName,
          args.linkedEntityName,
          `${__dirname}/../../src/server/database/seeds/003_${args.srcEntityName}.js`
        );

        // Change template XXXX's and YYYY's to entity names
        fixDirFileContents(
          logger,
          `${__dirname}/../../src/client/modules/${args.srcEntityName}`,
          makeArraySpec(args.srcEntityName, args.linkedEntityName)
        );
        fixDirFileContents(
          logger,
          `${__dirname}/../../src/server/modules/${args.srcEntityName}`,
          makeArraySpec(args.srcEntityName, args.linkedEntityName)
        );
        // Change template XXXX's and YYYY's in individual files under database
        logger.info(
          `Substituting non-templated areas in ${path.join(__dirname, '../../src/server/database/')}... files…`
        );
        fixFileContents(
          logger,
          `${__dirname}/../../src/server/database/migrations/003_${args.srcEntityName}.js`,
          makeArraySpec(args.srcEntityName, args.linkedEntityName)
        );
        fixFileContents(
          logger,
          `${__dirname}/../../src/server/database/seeds/003_${args.srcEntityName}.js`,
          makeArraySpec(args.srcEntityName, args.linkedEntityName)
        );

        // Add back reference to source entity in linked entity
        // // get module input data
        // const path = path.join(__dirname, '../../src/server/database/migration', args.linkedEntityName);
        // let data = fs.readFileSync(path);

        // // extract Feature modules
        // const re = /Feature\(([^()]+)\)/g;
        // const match = re.exec(data);
        // if (match) {
        //   const modules = match[1].split(',').filter(featureModule => featureModule.trim() !== module);

        //   // remove import module line
        //   const lines = data
        //     .toString()
        //     .split('\n')
        //     .filter(line => line.match(`import ${module} from './${module}';`) === null);
        //   fs.writeFileSync(path, lines.join('\n'));

        //   // remove module from Feature function
        //   shell.sed('-i', re, `Feature(${modules.toString().trim()})`, 'index.js');
        // }

        break;
      case 'deletemodule':
        deleteFiles(logger, templatePath, args.module, 'server/modules');
        [`${__dirname}/../../src/server/database/migrations`, `${__dirname}/../../src/server/database/seeds`].forEach(
          d => {
            [args.module, args.module.capitalize(), args.module.toUpperCase()].forEach(m => {
              if (fs.existsSync(`${d}/003_${m}.js`)) {
                fs.unlinkSync(`${d}/003_${m}.js`);
              }
            });
          }
        );
        break;
    }
  }
};
