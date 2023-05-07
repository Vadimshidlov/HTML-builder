const fs = require('node:fs/promises');
const fsWithoutPromises = require('fs');
const path = require('node:path');
const pathToFolder = path.join(__dirname);
const pathToFolderOfCopy = path.join(__dirname, 'files');
const pathToFolderToCopy = path.join(__dirname, 'files-copy');
console.log(pathToFolderOfCopy);

//create new folder
async function createDir() {
  fs.mkdir(path.join(pathToFolder, 'files-copy'), {
    recursive: true,
  });
}

async function copyDir() {
  try {
    const files = await fs.readdir(pathToFolderOfCopy, {
      withFileTypes: true,
    });
    for (let item of files) {
      const pathToFile = path.join(pathToFolderOfCopy, item.name);
      const newPathToFile = path.join(pathToFolderToCopy, item.name);
      fs.copyFile(pathToFile, newPathToFile);
    }
    // console.log(files);
  } catch (error) {
    console.log(error);
  }
}

fsWithoutPromises.rm(
  path.join(__dirname, 'files-copy'),
  { recursive: true },
  () => {
    createDir().then(() => {
      copyDir();
    });
  }
);
