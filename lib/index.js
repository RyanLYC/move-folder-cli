const commander = require("commander");
const log = require("npmlog");
const packageJson = require("../package.json");
const { checkNodeVersion, checkGlobalUpdate } = require("./utils");
const { moveFolder } = require("./core");
// const colors = require("colors/safe");

const program = new commander.Command();

async function prepare() {
  checkNodeVersion();
  await checkGlobalUpdate();
}

function command() {
  program
    .name(Object.keys(packageJson.bin)[0])
    .usage("[options]")
    .version(packageJson.version)
    .option("-d, --delete", "是否移动成功后删除文件夹", false)
    .option(
      "-n, --name <file extension such as app,test.ts>",
      "不复制这些文件名的文件可带扩展名可不带"
    )
    .option(
      "-ext, --extension <file extension such as .js,.ts>",
      "不复制这些扩展名的文件"
    )
    .option("-cd, --cd <Change Directory>", "更改复制目录"); // <> 代表 必须穿参数

  // 对未知命令监听
  program.on("command:*", (obj) => {
    // console.log(colors.red("未知的命令：" + obj));
    sourceFolderName = obj[0];
    targetFolderName = obj[1];
  });

  program.parse(process.argv);
  const options = program.opts();
  // log.info("options:", options);
  const setting = {
    cd: options.cd,
    delete: options.delete,
    fileNames: options.name?.split(" ") ?? [],
    fileExtensions: options.extension?.split(" ") ?? [],
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
