const path = require('node:path');
const fs = require('node:fs/promises');
const pathtoFolder = path.join(__dirname);
const pathtoFolderStyles = path.join(pathtoFolder, 'styles');
const pathToProjectDist = path.join(pathtoFolder, 'project-dist');
console.log(`----------->`, pathToProjectDist);
console.log(pathtoFolder);
console.log(pathtoFolderStyles);

// function createFile() {
//   fs.open(`${pathToProjectDist}/bundle.css`, "w", (err) => {
//     if (err) throw err;
//   });
// createFile();

async function bundleCss() {
  try {
    const files = await fs.readdir(pathtoFolderStyles, {
      withFileTypes: true,
    });

    for (item of files) {
      const itemExt = path.extname(item.name);
      if (item.isFile() && itemExt === '.css') {
        const pathToFile = path.join(pathtoFolderStyles, item.name);
        let dataOfItem = '';
        fs.readFile(pathToFile, 'utf8', function (error, data) {
          if (error) throw error;
          // console.log(data);
          // dataOfItem = data;
          // console.log(dataOfItem);
        }).then((data) => {
          fs.appendFile(`${pathToProjectDist}/bundle.css`, data, (err) => {
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
bundleCss();
