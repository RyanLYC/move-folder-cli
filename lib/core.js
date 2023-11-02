const slash = require("slash");
const path = require("path");
const fs = require("fs");
const { rimrafSync } = require("rimraf");
const { reporter } = require("./report");
const log = require("./log");

const normalize = (folder) =>
  !folder ? "" : slash(path.normalize(folder)).replace(/\/$/, "");

const posixPath = (nativePath) => slash(nativePath.replace(/.*:/, ""));

const relativePath = (fullPath, start) =>
  fullPath.substring(fullPath.indexOf(start) + start.length + 1);

const extraneousFolders = [".git", "node_modules"];
const extraneousFiles = [".DS_Store", "Thumbs.db", "desktop.ini"];

const filterNames = (fileNames, name) => {
  const isFileNames = !fileNames || fileNames.length === 0;
  const nameNoExt = name.replace(/[.].*/, "");
  return (
    isFileNames || (!fileNames.includes(nameNoExt) && !fileNames.includes(name))
  );
};
const copyNames = (copyFileNames, name) => {
  const isCopyFileNames = !copyFileNames || copyFileNames.length === 0;
  const nameNoExt = name.replace(/[.].*/, "");
  return (
    isCopyFileNames ||
    copyFileNames.includes(nameNoExt) ||
    copyFileNames.includes(name)
  );
};

const filterExt = (fileExtensions, ext) => {
  const isExt = !fileExtensions || fileExtensions.length === 0;
  return isExt || !fileExtensions.includes(ext);
};

const copyExt = (copyFileExtensions, ext) => {
  const isExt = !copyFileExtensions || copyFileExtensions.length === 0;
  return isExt || copyFileExtensions.includes(ext);
};

function moveFolder(sourceFolder, targetFolder, setting) {
  const startTime = Date.now();
  const startFolder = setting.cd ? normalize(setting.cd) + "/" : "";
  const source = normalize(startFolder + sourceFolder);
  const target = normalize(startFolder + targetFolder);
  if (targetFolder) {
    fs.mkdirSync(target, { recursive: true });
  }
  const errorMessage = !sourceFolder
    ? "必须指定源文件夹路径。"
    : !targetFolder
    ? "必须指定目标文件夹路径。"
    : !fs.existsSync(source)
    ? "源文件夹不存在: " + source
    : !fs.existsSync(target)
    ? "无法创建目标文件夹: " + target
    : !fs.statSync(source).isDirectory()
    ? "源不是文件夹: " + source
    : !fs.statSync(target).isDirectory()
    ? "目标不是文件夹: " + target
    : null;
  if (errorMessage) {
    log.error(errorMessage);
    return;
  }
  const files = [];
  const filter = (origin, dest) => {
    const isFile = fs.statSync(origin).isFile();
    const name = path.basename(origin);
    const ext = path.extname(origin);
    const keepFolder = !isFile && !extraneousFolders.includes(name);

    const keepFile =
      isFile &&
      (copyNames(setting.copyFileNames, name) ||
        copyExt(setting.copyFileExtensions, ext)) &&
      filterNames(setting.fileNames, name) &&
      filterExt(setting.fileExtensions, ext) &&
      !extraneousFiles.includes(name);

    if (keepFile)
      files.push({
        origin: relativePath(posixPath(origin), sourceFolder),
        dest: relativePath(posixPath(dest), targetFolder),
      });
    return keepFolder || keepFile;
  };
  fs.cpSync(source, target, { filter: filter, recursive: true });
  const duration = Date.now() - startTime;
  reporter(files, { duration, source, target });
  if (setting.delete) {
    rimrafSync(source);
  }
}

module.exports = { moveFolder };
