const log = require("npmlog");

log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info"; // 设置级别，低于这个级别的不会显示。例如自定义的level低于 info的2000 就不会输出显示； 设置verbose 的时候 debug 就会显示;根据参数来设置 是否是 debug 模式

log.heading = "move-folder-cli"; // 修改前缀
log.headingStyle = { fg: "cyan", bg: "black" }; // fg {String} Color for the foreground text  ; bg {String} Color for the background

// "silly" | "verbose" | "info" | "timing" | "http" | "notice" | "warn" | "error" | "silent";
log.addLevel("verbose", 1000, { fg: "cyan", bg: "black" }, "debug");
log.addLevel("success", 6000, { fg: "green", bold: true }, "SUCCESS");

module.exports = log;
