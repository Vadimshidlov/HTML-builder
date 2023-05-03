// const fs = require("fs");
// const fs = require("fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const pathToFolder = path.join(__dirname);
const pathToFolderOfCopy = path.join(__dirname, "files");
console.log(pathToFolderOfCopy);

//create new folder
fs.mkdir(path.join(pathToFolder, "files-copy"), {
  recursive: true,
});
const pathToFolderToCopy = path.join(__dirname, "files-copy");
console.log(pathToFolderToCopy);

async function copyDir() {
  try {
    const files = await fs.readdir(pathToFolderOfCopy, {
      withFileTypes: true,
    });
    for (item of files) {
      const pathToFile = path.join(pathToFolderOfCopy, item.name);
      console.log(`old -->`, pathToFile);
      const newPathToFile = path.join(pathToFolderToCopy, item.name);
      console.log(`new -->`, newPathToFile);
      fs.copyFile(pathToFile, newPathToFile);
    }
    // console.log(files);
  } catch (error) {
    console.log(error);
  }
}
copyDir();
