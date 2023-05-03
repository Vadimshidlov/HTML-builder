const path = require("node:path");
const fs = require("node:fs/promises");
const myfolderPath = path.join(__dirname, "secret-folder");
const fsTwo = require("fs");

async function getFiles() {
  try {
    const files = await fs.readdir(myfolderPath, { withFileTypes: true });
    for (item of files) {
      // console.log(path.extname(item.name));
      if (item.isFile()) {
        const itemName = item.name.slice(0, item.name.indexOf("."));
        const itemExt = path
          .extname(item.name)
          .slice(1, path.extname(item.name).length);
        let itemSize = 0;
        // console.log(item);
        // console.log(itemName);
        // console.log(itemExt);
        // console.log(item.isFile());
        // console.log(path.extname(path.join(__dirname, "secret-folder", item)));
        fsTwo.stat(
          path.join(myfolderPath, `${item.name}`),
          function (err, stats) {
            if (err) {
              console.log(err);
            } else {
              // console.log(stats.size);
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
