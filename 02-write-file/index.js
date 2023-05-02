const path = require("node:path");
const fs = require("fs");
const process = require("node:process");
const pathToFile = path.join(__dirname);
const readline = require("node:readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Hello, my dear friend");

function createFile() {
  fs.open(`${pathToFile}/newFile.txt`, "w", (err) => {
    if (err) throw err;
    // console.log("file created");
  });
}
createFile();

process.on("SIGINT", (signal) => {
  process.exit();
});

process.on("exit", () => {
  readline.close();
  console.log("Goodbye, my dear friend!");
});

function getQuestion() {
  readline.question("", (answer) => {
    if (answer === "exit") {
      process.exit();
    }

    fs.appendFile(`${pathToFile}/newFile.txt`, answer + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
    getQuestion();
  });
}
getQuestion();
