const path = require("node:path");
const fs = require("fs");

const pathToFile = path.join(__dirname, "text.txt");
fs.readFile(pathToFile, "utf8", function (error, data) {
  if (error) throw error;
  console.log(data);
});
