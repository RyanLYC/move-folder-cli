const commander = require("commander");
const log = require("./log");
const packageJson = require("../package.json");
const {
  checkPackageVersion,
  checkNodeVersion,
  checkGlobalUpdate,
} = require("./utils");
const { moveFolder } = require("./core");

const program = new commander.Command();

async function prepare() {
  checkPackageVersion();
  checkNodeVersion();
  await checkGlobalUpdate();
}

function command() {
  program
    .name(Object.keys(packageJson.bin)[0])
    .usage("[options]")
    .version(packageJson.version)
    .option("--d, --debug", "是否开启调试模式", false)
    .option("-d, --delete", "是否移动成功后删除文件夹", false)
    .option(
      "-n, --name <file extension such as app,test.ts>",
      "不复制这些文件名的文件可带扩展名可不带"
    )
    .option(
      "-ext, --extension <file extension such as .js,.ts>",
      "不复制这些扩展名的文件"
    )
    .option(
      "-cn, --copyName <file extension such as app,test.ts>",
      "复制这些文件名的文件可带扩展名可不带"
    )
    .option(
      "-cext, --copyExtension <file extension such as .js,.ts>",
      "复制这些扩展名的文件"
    )
    .option("-cd, --cd <Change Directory>", "更改复制目录"); // <> 代表 必须穿参数

  // 开启debug模式
  program.on("option:debug", function () {
    const options = program.opts();
    if (options.debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose("开启调试模式");
  });

  // 对未知命令监听
  program.on("command:*", (obj) => {
    log.verbose("文件夹名称[source, target]:", obj);
    sourceFolderName = obj[0];
    targetFolderName = obj[1];
  });

  program.parse(process.argv);
  const options = program.opts();
  log.verbose("options", options);
  const setting = {
    cd: options.cd,
    delete: options.delete,
    fileNames: options.name?.split(" ") ?? [],
    fileExtensions: options.extension?.split(" ") ?? [],
    copyFileNames: options.copyName?.split(" ") ?? [],
    copyFileExtensions: options.copyExtension?.split(" ") ?? [],
  };
  moveFolder(sourceFolderName, targetFolderName, setting);
}

async function core() {
  try {
    await prepare();
    command();
  } catch (e) {
    log.error(e.message);
  }
}

module.exports = core;
