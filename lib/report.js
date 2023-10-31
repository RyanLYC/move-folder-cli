const chalk = require("chalk");
const log = require("fancy-log");

function reporter(files, results) {
  const name = chalk.gray("move-folder-cli");
  const source = chalk.blue.bold(results.source);
  const target = chalk.magenta(results.target);
  const arrow = { big: chalk.gray.bold(" ⟹  "), little: chalk.gray.bold("→") };
  const infoColor = files.length ? chalk.white : chalk.red.bold;
  const info = infoColor(`(files: ${files.length}, ${results.duration}ms)`);
  log(name, source, arrow.big, target, info);
  const logFile = (file) =>
    log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
  files.forEach(logFile);
}

module.exports = { reporter };
