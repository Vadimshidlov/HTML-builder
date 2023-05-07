const fs = require('node:fs/promises');
const path = require('node:path');
const fsWithoutPromises = require('fs');

const pathToFolder = path.join(__dirname);

async function createDir(){
  fs.mkdir(path.join(pathToFolder, 'project-dist'), {
    recursive: true,
  });
}

const pathToTemplateFile = path.join(__dirname, 'template.html');
const pathToProjectDist = path.join(pathToFolder, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const arrOFStylesName = [];
const dataOfComponents = {};

let templateFileData = '';

async function readFileTemplate() {
  try {
    templateFileData = await fs.readFile(pathToTemplateFile, {
      encoding: 'utf8',
    });
  } catch (err) {
    console.log(err);
  }
}


async function getArrOfTemplateTags() {
  try {
    const files = await fs.readdir(pathToComponents, {
      withFileTypes: true,
    });
    for (let item of files) {
      const componentName = item.name.slice(0, item.name.indexOf('.'));
      arrOFStylesName.push(componentName);
      fs.readFile(path.join(pathToComponents, item.name)).then((data) => {
        dataOfComponents[componentName] = data;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// create bundle css
const pathToFolderStyles = path.join(__dirname, 'styles');

async function bundleCss() {
  try {
    const files = await fs.readdir(pathToFolderStyles, {
      withFileTypes: true,
    });

    for (let item of files) {
      const itemExt = path.extname(item.name);
      if (item.isFile() && itemExt === '.css') {
        const pathToFile = path.join(pathToFolderStyles, item.name);
        fs.readFile(pathToFile, 'utf8', function (error) {
          if (error) throw error;
        }).then((data) => {
          fs.appendFile(`${pathToProjectDist}/style.css`, data, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// copy assets directory
const pathToFolderOfCopy = path.join(__dirname, 'assets');
const pathToFolderToCopy = path.join(pathToProjectDist, 'assets');

async function copyDir(src, dest) {
  try {
    const files = await fs.readdir(src, {
      withFileTypes: true,
    });
    await fs.mkdir(dest);
    for (let item of files) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);
      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

fsWithoutPromises.rm(
  pathToProjectDist,
  { recursive: true },
  () => {
    createDir().then(()=>{
      readFileTemplate()
        .then(() => {
          fs.writeFile(`${pathToProjectDist}/index.html`, templateFileData, (err) => {
            if (err) throw err;
          });
        })
        .then(() => {
          getArrOfTemplateTags()
            .then(() => {
              const pathToNewHtmlFile = path.join(pathToProjectDist, 'index.html');
              let contentOfNewHtmlFile = '';
              fs.readFile(pathToNewHtmlFile, 'utf-8', function (err) {
                if (err) {
                  console.log(err);
                }
              }).then((content) => {
                contentOfNewHtmlFile = content;
                for (let i = 0; i < arrOFStylesName.length; i++) {
                  let current = arrOFStylesName[i];
                  contentOfNewHtmlFile = contentOfNewHtmlFile.replace(
                    new RegExp(`{{${current}}}`, 'g'),
                    dataOfComponents[arrOFStylesName[i]]
                  );
                }
                fs.writeFile(
                  pathToNewHtmlFile,
                  contentOfNewHtmlFile,
                  'utf-8',
                  function (err) {
                    console.log(err);
                  }
                );
              });
            })
            .then(() => {
              bundleCss();
              copyDir(pathToFolderOfCopy, pathToFolderToCopy);
            });
        });
    });
  }
);


