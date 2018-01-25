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

function copyRenameFiles(logger, moduleName, /* linkedEntityName = '', */ location, files, destinationPath) {
  // copy files
  shell.cp('-R', files, destinationPath);
  logger.info(`✔ The ${location} files have been copied!`);

  // change to destination directory & rename files & module names
  // rename files
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      [
        { name: 'xxxx', newName: moduleName },
        { name: 'Xxxx', newName: moduleName.capitalize() },
        { name: 'XXXX', newName: moduleName.toUpperCase() }
      ].forEach(e => {
        if (entry.name.indexOf(e.name) >= 0) {
          const moduleFile = entry.name.replace(e.name, e.newName);
          shell.mv(`${destinationPath}/${entry.name}`, `${destinationPath}/${moduleFile}`);
        }
      });
    }
  });
  // console.log(linkedEntityName);
  // shell.ls('-Rl', destinationPath).forEach(entry => {
  //   if (entry.isFile()) {
  //     [
  //       { name: 'yyyy', newName: linkedEntityName },
  //       { name: 'Yyyy', newName: linkedEntityName.capitalize() },
  //       { name: 'YYYY', newName: linkedEntityName.toUpperCase() }
  //     ].forEach(e => {
  //       if (entry.name.indexOf(e.name) >= 0) {
  //         const moduleFile = entry.name.replace(e.name, e.newName);
  //         shell.mv(`${destinationPath}/${entry.name}`, `${destinationPath}/${moduleFile}`);
  //       }
  //     });
  //   }
  // });

  // replace module names in files
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      shell.sed('-i', /xxxx/g, moduleName, `${destinationPath}/${entry.name}`);
      shell.sed('-i', /XXXX/g, moduleName.toUpperCase(), `${destinationPath}/${entry.name}`);
      shell.sed('-i', /Xxxx/g, moduleName.toCamelCase().capitalize(), `${destinationPath}/${entry.name}`);
      // shell.sed('-i', /yyyy/g, linkedEntityName, `${destinationPath}/${entry.name}`);
      // shell.sed('-i', /YYYY/g, linkedEntityName.toUpperCase(), `${destinationPath}/${entry.name}`);
      // shell.sed('-i', /Yyyy/g, linkedEntityName.toCamelCase().capitalize(), `${destinationPath}/${entry.name}`);
    }
  });

  // add back-references for Xxxx to Yyyy, if Yyyy already exists....
}

function templateAlterFiles(logger, moduleName, srcEntityName, linkedEntityName, location, files, destPath) {
  // copy files
  let destinationPath = path.join(destPath, srcEntityName);
  shell.cp('-R', files, destinationPath);
  logger.info(`✔ The ${location} files have been copied!`);

  // rename files
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      [
        { name: 'yyyy', newName: linkedEntityName },
        { name: 'Yyyy', newName: linkedEntityName.capitalize() },
        { name: 'YYYY', newName: linkedEntityName.toUpperCase() }
      ].forEach(e => {
        if (entry.name.indexOf(e.name) >= 0) {
          const moduleFile = entry.name.replace(e.name, e.newName);
          shell.mv(`${destinationPath}/${entry.name}`, `${destinationPath}/${moduleFile}`);
        }
      });
    }
  });

  // // replace module names in files
  // shell.ls('-Rl', destinationPath).forEach(entry => {
  //   if (entry.isFile()) {
  //     shell.sed('-i', /xxxx/g, moduleName, `${destinationPath}/${entry.name}`);
  //     shell.sed('-i', /XXXX/g, moduleName.toUpperCase(), `${destinationPath}/${entry.name}`);
  //     shell.sed('-i', /Xxxx/g, moduleName.toCamelCase().capitalize(), `${destinationPath}/${entry.name}`);
  //     shell.sed('-i', /yyyy/g, linkedEntityName, `${destinationPath}/${entry.name}`);
  //     shell.sed('-i', /YYYY/g, linkedEntityName.toUpperCase(), `${destinationPath}/${entry.name}`);
  //     shell.sed('-i', /Yyyy/g, linkedEntityName.toCamelCase().capitalize(), `${destinationPath}/${entry.name}`);
  //   }
  // });

  // change to destination directory & template-substitute values
  shell.ls('-Rl', path.join(destinationPath, srcEntityName)).forEach(entry => {
    let filePath = path.join(destinationPath, srcEntityName, entry.name);
    if (entry.isFile()) {
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
      //   console.log(templates);

      let contentOut = '';
      contents.split('\n').forEach(l => {
        let matchTemplateTarget = l.match(/(\/\/|#)\sTARGET-LINKED-MODULE-TEMPLATE-(.+)/);
        contentOut += `${l}\n`;
        if (matchTemplateTarget) {
          contentOut += `${templates[matchTemplateTarget[2]]}\n`;
        }
      });

      fs.writeFileSync(filePath, contentOut);
    }
  });

  // add back-references for Xxxx to Yyyy, if Yyyy already exists....
}

function copyFiles(logger, templatePath, module, /* linkedEntityName = '', */ location) {
  logger.info(`Copying ${location} files…`);

  // create new module directory
  const mkdir = shell.mkdir(`${__dirname}/../../src/${location}/${module}`);

  // continue only if directory does not yet exist
  if (mkdir.code === 0) {
    const destinationPath = `${__dirname}/../../src/${location}/${module}`;
    copyRenameFiles(logger, module, /* linkedEntityName, */ location, `${templatePath}/${location}/*`, destinationPath);

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

function deleteFiles(logger, templatePath, module, location) {
  logger.info(`Deleting ${location} files…`);

  const modulePath = `${__dirname}/../../src/${location}/${module}`;

  if (fs.existsSync(modulePath)) {
    // create new module directory
    shell.rm('-rf', modulePath);

    // change to destination directory
    shell.cd(`${__dirname}/../../src/${location}/`);

    // add module to Feature function
    //let ok = shell.sed('-i', `import ${module} from '.\/${module}';`, '', 'index.js');

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
        copyFiles(logger, templatePath, args.module, /* args.linkedEntityName, */ 'client/modules');
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
        copyFiles(logger, templatePath, args.module, /* args.linkedEntityName, */ 'server/modules');
        if (fs.existsSync(`${templatePath}/server/database`)) {
          copyRenameFiles(
            logger,
            args.module,
            /* args.linkedEntityName, */
            'server/database',
            `${templatePath}/server/database/*`,
            `${__dirname}/../../src/server/database`
          );
        }
        break;
      case 'link-modules':
        // Add links to server module
        copyRenameFiles(
          logger,
          path.join(templatePath, 'server/modules'),
          args.module,
          /* args.linkedEntityName, */ 'server/modules'
        );

        // Add files to client module
        copyRenameFiles(
          logger,
          path.join(templatePath, 'client/modules'),
          args.module,
          /* args.linkedEntityName, */ 'client/modules'
        );

        // Alter client GUI to include linked modules
        // if (fs.existsSync(`${templatePath}/server/modules`)) {
        templateAlterFiles(
          logger,
          args.module,
          args.srcEntityName,
          args.linkedEntityName,
          'server/database',
          path.join(templatePath, 'server/modules/*'),
          path.join(__dirname, '../../src/server/modules')
        );
        templateAlterFiles(
          logger,
          args.module,
          args.srcEntityName,
          args.linkedEntityName,
          'server/database',
          path.join(templatePath, 'client/modules/*'),
          path.join(__dirname, '../../src/client/modules')
        );
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
