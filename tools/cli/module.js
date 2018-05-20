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

// function makeArraySeedsSpec(seed_count, linked_seed_count) {
//   // Order is important for substitutions in this array.
//   return [{ name: 'LINKED_SEED_COUNT', newName: linked_seed_count }, { name: 'SEED_COUNT', newName: seed_count }];
// }

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

// Expand out templated text, defined between START_ and END_ tags, into TARGET_ areas.
function templateAlterFile(logger, templateName, filePath) {
  // Read file
  let linesContent = fs
    .readFileSync(filePath)
    .toString()
    .split('\n');
  // Find templates in file.
  let templates = {};
  let activeTemplateIds = []; // manage template nesting
  let reStartAnyTemplate = new RegExp(`(\\/\\/|#)\\sSTART\\-(.+\\-.+)`);
  let reEndAnyTemplate = new RegExp(`(\\/\\/|#)\\sEND\\-(.+\\-.+)`);
  let reTemplateTargetWithSeparator = new RegExp(
    // Note the leading '{' for JSX
    `(\\{?\\/\\/|#)\\sTARGET\\-(${templateName.replace(
      /\\-/g,
      '\\-'
    )}\\-\\S+)\\s*(USE-SEPARATOR)?\\(?\\'?([^']*)\\'?\\)?\\s*(prepend-separator)?`
  );
  let reTemplatePrefixComment = new RegExp('^(\\s*)(\\/\\/\\s|#)(.*)');
  linesContent.forEach(l => {
    let matchTemplateStart = l.match(reStartAnyTemplate);
    if (matchTemplateStart) {
      // track template nesting
      let templateId = matchTemplateStart[2];
      activeTemplateIds.push(templateId);
      templates[templateId] = '';
    }
    activeTemplateIds
      .slice()
      .reverse() // work with greatest nested templates first
      .forEach(templateId => {
        let matchTemplateEnd = l.match(reEndAnyTemplate);
        if (matchTemplateEnd) {
          let idx = activeTemplateIds.indexOf(matchTemplateEnd[2]);
          if (idx >= 0) {
            activeTemplateIds.splice(idx, 1); // remote template whose end has just been found
          }
        }
        templates[templateId] += `${l}\n`;
      });
  });
  // Make template-substituted output by filling in template TARGET-(s) with stored template text.
  let expandTemplate = function(templateText) {
    // console.log(`Raw Template Text\n${templateText}\n`)
    let contentOut = '';
    // Manage template nesting
    let nestedTemplates = [];
    templateText.split('\n').forEach(l => {
      let matchTemplateStart = l.match(reStartAnyTemplate);
      if (matchTemplateStart) {
        nestedTemplates.push(matchTemplateStart[2]); // track template nesting
        // Don't output the outer template Start
        if (nestedTemplates.length == 1) {
          return;
        }
      } else {
        let matchTemplateEnd = l.match(reEndAnyTemplate);
        if (matchTemplateEnd) {
          let idx = nestedTemplates.indexOf(matchTemplateEnd[2]);
          if (idx >= 0) {
            nestedTemplates.splice(idx, 1); // remote template whose end has just been found
          }
          // Don't output the outer template End
          if (nestedTemplates.length == 0) {
            return;
          }
        }
      }
      // // Don't output the outer template Target
      // let matchTemplateTarget = l.match(reTemplateTarget);
      // if (matchTemplateTarget && nestedTemplates.length == 1) {
      //   return;
      // }
      // Output the prefix-stripped template text.
      let matchTemplatePrefix = l.match(reTemplatePrefixComment);
      if (matchTemplatePrefix) {
        contentOut += `${matchTemplatePrefix[1]}${matchTemplatePrefix[3]}\n`; // append text to active template
      } else {
        contentOut += `${l}\n`;
      }
    });
    // console.log(`Expanded Template Text\n${contentOut}\n`)
    return contentOut;
  };
  // Now create content with expanded templates
  let contentOut = '';
  linesContent.forEach(l => {
    let matchTemplateStart = l.match(reStartAnyTemplate);
    // Manage template nesting
    if (matchTemplateStart) {
      activeTemplateIds.push(matchTemplateStart[2]); // track template nesting
    } else {
      let matchTemplateEnd = l.match(reEndAnyTemplate);
      if (matchTemplateEnd) {
        let idx = activeTemplateIds.indexOf(matchTemplateEnd[2]);
        if (idx >= 0) {
          activeTemplateIds.splice(idx, 1); // remote template whose end has just been found
        }
      }
    }
    if (activeTemplateIds.length == 0) {
      // Not in a template definition
      let matchTemplateTarget = l.match(reTemplateTargetWithSeparator);
      if (matchTemplateTarget) {
        // console.log(`barf - ${filePath}`)
        // console.log(l);
        // console.log(matchTemplateTarget);
        if (matchTemplateTarget[3] && matchTemplateTarget[3].indexOf('USE-SEPARATOR') >= 0) {
          if (!matchTemplateTarget[5] || matchTemplateTarget[5] != 'prepend-separator') {
            // console.log(` larf ${matchTemplateTarget} - ${matchTemplateTarget[5]}`)
            l += ' prepend-separator';
          } else {
            // console.log(` darf ${matchTemplateTarget} - ${matchTemplateTarget[3]}`)
            contentOut = contentOut.slice(0, contentOut.length - 2);
            contentOut += `${matchTemplateTarget[4]}\n`;
          }
        }
        // console.log(`Expanding template: template=${matchTemplateTarget[2]} templateName=${templateName} filePath=${filePath}`);
        contentOut += expandTemplate(templates[matchTemplateTarget[2]]);
      }
    }
    contentOut += `${l}\n`;
  });
  contentOut = contentOut.substring(0, contentOut.length - 1);
  // Rewrite file w/template-substituted content
  fs.writeFileSync(filePath, contentOut);
}

function templateAlterFiles(logger, templateName, destinationPath) {
  // logger.info(`Template substituting ${destinationPath} files…`);
  // template-substitute values
  shell.ls('-Rl', destinationPath).forEach(entry => {
    let filePath = path.join(destinationPath, entry.name);
    if (entry.isFile()) {
      templateAlterFile(logger, templateName, filePath);
    }
  });
}

// Name correct by spec (eg. XXXX and YYYY), but only outside of templates.
function specCorrectAlterTemplateText(logger, filePath, arraySpec) {
  let contentOut = '';
  // Read file
  let linesContent = fs
    .readFileSync(filePath)
    .toString()
    .split('\n');
  // Gather templates
  let templateId = null;
  linesContent.forEach(l => {
    let reStart = new RegExp(`(\\/\\/|#)\\sSTART\\-(\\S+)\\-(.+)`);
    let matchTemplateStart = l.match(reStart);
    if (matchTemplateStart) {
      templateId = matchTemplateStart[3];
    } else {
      if (templateId != null) {
        let reEnd = new RegExp(`(\\/\\/|#)\\sEND\\-(\\S+)\\-(.+)`);
        let matchTemplateEnd = l.match(reEnd);
        if (matchTemplateEnd) templateId = null;
      }
      // Only spec-substitute when outside templates
      if (templateId == null) {
        arraySpec.forEach(e => {
          let re = new RegExp(e.name, 'g');
          if (e.newName) {
            l = l.replace(re, e.newName);
          }
        });
      }
    }
    contentOut += `${l}\n`;
  });
  contentOut = contentOut.substring(0, contentOut.length - 1);
  // Rewrite file w/template-substituted content
  fs.writeFileSync(filePath, contentOut);
}

function xyNamesSubDirFileContents(logger, destinationPath, arraySpec) {
  // logger.info(`Substituting non-templated areas in ${destinationPath} files…`);
  shell.ls('-Rl', destinationPath).forEach(entry => {
    if (entry.isFile()) {
      let filePath = path.join(destinationPath, entry.name);
      specCorrectAlterTemplateText(logger, filePath, arraySpec);
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
    case 'link-modules':
      templatePath = `${__dirname}/../link-modules-templates/module`;
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
        copyModuleFiles(logger, args.module, templatePath, 'client/modules');

        // Template expand ADD-MENU-ITEM template
        logger.info(`Adding menu items`);
        if (!options.nomenu) {
          templateAlterFiles(logger, 'ADD-MENU-ITEM-TEMPLATE', `${__dirname}/../../src/client/modules/${args.module}`);
        }

        xyNamesSubDirFileContents(
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
        // Create server module files
        copyModuleFiles(logger, args.module, templatePath, 'server/modules');
        xyNamesSubDirFileContents(
          logger,
          `${__dirname}/../../src/server/modules/${args.module}`,
          makeArraySpec(args.module, null)
        );
        // Create out server database files, if there are any in the template dir.
        if (fs.existsSync(`${templatePath}/server/database`)) {
          copyfixFileNames(
            logger,
            args.module,
            `${templatePath}/server/database/*`,
            `${__dirname}/../../src/server/database`
          );
          // Template expand seed template
          logger.info(`Adding seeds`);
          [`${__dirname}/../../src/server/database/seeds/003_${args.module}.js`].forEach(f => {
            templateAlterFile(logger, 'SEED-TEMPLATE', f);
          });
          [
            `${__dirname}/../../src/server/database/migrations/`,
            `${__dirname}/../../src/server/database/seeds/`
          ].forEach(dir => {
            xyNamesSubDirFileContents(logger, dir, makeArraySpec(args.module, null));
          });
        }

        // Optionally deal with seeds
        if (options.seedCount) {
          // Add seeds
          logger.info(`Setting seed counts`);
          let seedFiles = [`${__dirname}/../../src/server/database/seeds/003_${args.module}.js`];
          seedFiles.forEach(s => {
            specCorrectAlterTemplateText(logger, s, [{ name: 'SEED_COUNT', newName: options.seedCount }]);
          });
        }

        break;
      case 'link-modules':
        {
          let linkedRelationType = null,
            seedType = null;
          if (args.type == 'one-way') {
            linkedRelationType = 'TEMPLATE-1-TO-MANY-LINKED-ENTITY';
            seedType = 'SEED-1-TO-MANY-LINKED-ENTITY-TEMPLATE';
          } else {
            linkedRelationType = 'TEMPLATE-MANY-TO-MANY-LINKED-ENTITY';
            seedType = 'SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE';
          }
          let moduleDirs = [
            `${__dirname}/../../src/client/modules/${args.srcEntityName}`,
            `${__dirname}/../../src/server/modules/${args.srcEntityName}`
          ];
          let migrationFiles = [
            `${__dirname}/../../src/server/database/migrations/003_${args.srcEntityName}.js`,
            `${__dirname}/../../src/server/database/migrations/003_${args.linkedEntityName}.js`
          ];
          let seedFiles = [
            `${__dirname}/../../src/server/database/seeds/003_${args.srcEntityName}.js`,
            `${__dirname}/../../src/server/database/seeds/003_${args.linkedEntityName}.js`
          ];
          let dbFiles = [...migrationFiles, ...seedFiles];

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

          // Template expand client & server files
          ['TEMPLATE-LINKED-ENTITY', linkedRelationType].forEach(t => {
            moduleDirs.forEach(p => {
              templateAlterFiles(logger, t, p);
            });
          });
          // Handle individual files under database to include linked modules
          ['TEMPLATE-LINKED-ENTITY', linkedRelationType].forEach(t => {
            dbFiles.forEach(p => {
              templateAlterFile(logger, t, p);
            });
          });
          // Add linked entity generation to source entity
          [
            `${__dirname}/../../src/server/database/seeds/003_${args.srcEntityName}.js`,
            `${__dirname}/../../src/server/database/migrations/003_${args.srcEntityName}.js`
          ].forEach(f => {
            // console.log(`Expanding ${seedType} on ${f}`);
            templateAlterFile(logger, seedType, f);
          });
          // Change template XXXX's and YYYY's to entity names
          // logger.info(`Substituting non-templated areas in all scaffolded files…`);
          moduleDirs.forEach(p => {
            xyNamesSubDirFileContents(logger, p, makeArraySpec(args.srcEntityName, args.linkedEntityName));
          });
          dbFiles.forEach(f => {
            specCorrectAlterTemplateText(logger, f, makeArraySpec(args.srcEntityName, args.linkedEntityName));
          });

          // Optionally deal with seeds
          if (options.linkedSeedCount) {
            // Add linked seeds
            logger.info(`Setting linked seed counts`);
            let seedFiles = [`${__dirname}/../../src/server/database/seeds/003_${args.srcEntityName}.js`];
            seedFiles.forEach(s => {
              specCorrectAlterTemplateText(logger, s, [
                { name: 'LINKED_SEED_COUNT', newName: options.linkedSeedCount }
              ]);
            });
          }
        }
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

  // let seedFiles = [];
  // switch (action) {
  //   case 'set-seed-counts':
  //     // Change seed counts

  //     args.srcModules.forEach(m => {
  //       seedFiles.push(`${__dirname}/../../src/server/database/seeds/003_${m}.js`);
  //     });
  //     logger.info(`Setting seed counts for ${args.srcModules} (${seedFiles})`);
  //     seedFiles.forEach(s => {
  //       specCorrectAlterTemplateText(logger, s, makeArraySeedsSpec(options.seedCount, options.linkedSeedCount));
  //     });
  //     break;
  // }
};
