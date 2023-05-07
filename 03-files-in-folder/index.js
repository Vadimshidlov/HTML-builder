const path = require('node:path');
const fs = require('node:fs/promises');
const myFolderPath = path.join(__dirname, 'secret-folder');
const fsTwo = require('fs');

async function getFiles() {
  try {
    const files = await fs.readdir(myFolderPath, { withFileTypes: true });
    for (let item of files) {
      if (item.isFile()) {
        const itemName = item.name.slice(0, item.name.indexOf('.'));
        const itemExt = path
          .extname(item.name)
          .slice(1, path.extname(item.name).length);
        fsTwo.stat(
          path.join(myFolderPath, `${item.name}`),
          function (err, stats) {
            if (err) {
              console.log(err);
            } else {
              console.log(`${itemName} - ${itemExt} - ${stats.size / 1000}kb`);
            }
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
}
getFiles();
