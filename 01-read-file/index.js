const path = require('node:path');
const fs = require('fs');
const pathToFile = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(pathToFile, { encoding: 'utf-8' });
readStream.on('data', (text) => {
  console.log(text);
});
