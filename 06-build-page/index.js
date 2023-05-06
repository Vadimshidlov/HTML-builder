const fs = require('node:fs/promises');
const path = require('node:path');

const pathToFolder = path.join(__dirname);
// const pathToNewFolder = path.join(pathToFolder, );
// createnewFolder project-dist
const newFolder = fs.mkdir(path.join(pathToFolder, 'project-dist'), {
  recursive: true,
});

// copy, moving and replace html file

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

// readFileTemplate().then(() => console.log(templateFileData));

async function getArrOfTemplateTags() {
  try {
    const files = await fs.readdir(pathToComponents, {
      withFileTypes: true,
    });
    console.log(files);
    for (let item of files) {
      const componentName = item.name.slice(0, item.name.indexOf('.'));
      console.log(item.name.slice(0, item.name.indexOf('.')));
      arrOFStylesName.push(componentName);
      // fs.readFile(
      // path.join(pathToComponents, item.name),
      // "utf8",
      // function (err, data) {
      // if (err) throw err;
      // console.log(item);
      // dataOfComponents[item.name] = data;
      // }
      // );
      fs.readFile(path.join(pathToComponents, item.name)).then((data) => {
        // console.log(data);
        console.log(dataOfComponents);
        console.log(item.name);
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
        let dataOfItem = '';
        fs.readFile(pathToFile, 'utf8', function (error, data) {
          if (error) throw error;
          // console.log(data);
          // dataOfItem = data;
          // console.log(dataOfItem);
        }).then((data) => {
          fs.appendFile(`${pathToProjectDist}/style.css`, data, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });

        // console.log(path.extname(item.name));
        // console.log(item.name);
        // console.log(pathToFile);
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
      // console.log('old -->', pathToFile);
      const destPath = path.join(dest, item.name);
      if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
      // console.log('new -->', newPathToFile);
    }
    // console.log(files);
  } catch (error) {
    console.log(error);
  }
}

readFileTemplate()
  .then(() => {
    // function createFileHtml(data) {
    fs.writeFile(`${pathToProjectDist}/index.html`, templateFileData, (err) => {
      if (err) throw err;
      console.log('file created');
    });
    // }
    // createFileHtml(templateFileData);
  })
  .then(() => {
    getArrOfTemplateTags()
      .then(() => {
        const pathToNewHtmlFile = path.join(pathToProjectDist, 'index.html');
        let contentOfNewHtmlFile = '';
        fs.readFile(pathToNewHtmlFile, 'utf-8', function (err, content) {
          if (err) {
            console.log(err);
            return;
          }
        }).then((content) => {
          contentOfNewHtmlFile = content;
          for (let i = 0; i < arrOFStylesName.length; i++) {
            let current = arrOFStylesName[i];
            contentOfNewHtmlFile = contentOfNewHtmlFile.replace(
              new RegExp(`{{${current}}}`, 'g'),
              // /{{[`${arrOFStylesName[i]}`]}}/g,
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

        console.log(arrOFStylesName);
        // console.log(dataOfComponents);
      })
      .then(() => {
        bundleCss();
        copyDir(pathToFolderOfCopy, pathToFolderToCopy);
      });
  });
