#!/usr/bin/env node
//////////////////////
// move-folder-cli //
//////////////////////

const importLocal = require("import-local");

/** 当本地node_modules存在一个脚手架命令，同时全局node_modules中也存在这个脚手架命令的时候，优先选用**本地node_modules**中的版本 */
if (importLocal(__filename)) {
  require("npmlog").info(
    "move-folder-cli",
    "正在使用 move-folder-cli 本地版本"
  );
} else {
  require(".")();
}
