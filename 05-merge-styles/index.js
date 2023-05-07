const path = require('node:path');
const fs = require('node:fs/promises');
const fsWithoutPromises = require('fs');
const pathtoFolder = path.join(__dirname);
const pathtoFolderStyles = path.join(pathtoFolder, 'styles');
const pathToProjectDist = path.join(pathtoFolder, 'project-dist');

async function bundleCss() {
  try {
    const files = await fs.readdir(pathtoFolderStyles, {
      withFileTypes: true,
    });

    for (let item of files) {
      const itemExt = path.extname(item.name);
      if (item.isFile() && itemExt === '.css') {
        const pathToFile = path.join(pathtoFolderStyles, item.name);
        fs.readFile(pathToFile, 'utf8', function (error) {
          if (error) throw error;
        }).then((data) => {
          fs.appendFile(`${pathToProjectDist}/bundle.css`, data, (err) => {
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


fsWithoutPromises.unlink(path.join(pathToProjectDist, 'bundle.css'), ()=>{
  bundleCss();
});

