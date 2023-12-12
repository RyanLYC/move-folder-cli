const urlJoin = require("url-join");
const packageJson = require("../package.json");
const axios = require("axios");
const semver = require("semver");
const colors = require("colors/safe");
const log = require("./log");

function checkNodeVersion() {
  const semver = require("semver");
  if (!semver.gte(process.version, "16.7.0")) {
    throw new Error(
      colors.red(`move-folder-cli 需要安装 v16.7.0 以上版本的 Node.js`)
    );
  }
}

/** 检测版本 */
function checkPackageVersion() {
  log.info("当前版本:", packageJson.version);
}

function getNpmRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

function getNpmInfo(npmName, registry) {
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getNpmRegistry(false);
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  return axios
    .get(npmInfoUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}
/** 获取所有 大于 当前版本好数组并排序 */
function getSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
  return null;
}

/**提示全局更新 */
async function checkGlobalUpdate() {
  const currentVersion = packageJson.version;
  const npmName = packageJson.name;
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      colors.yellow(
        `请手动更新 ${npmName}，当前版本:${currentVersion}，最新版本:${lastVersion}更新命令: npm install / yarn add ${npmName} -g`
      )
    );
    // log.warn(
    //   `请手动更新 ${npmName}，当前版本:${currentVersion}，最新版本:${lastVersion}更新命令: npm install / yarn add  ${npmName} -g`
    // );
  }
}

module.exports = { checkPackageVersion, checkNodeVersion, checkGlobalUpdate };
