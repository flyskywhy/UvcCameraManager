var gitRepoInfo = require('git-repo-info');
var packageJson = require('../package.json');
var name = packageJson.name;
var version = packageJson.version;

module.exports = function (/* environment, appConfig */) {
  var currentInfo = gitRepoInfo();

  return {
    name: name,
    version: version,
    longRevision: currentInfo.sha,
    branch: currentInfo.branch,
    tag: currentInfo.tag,
    committer: currentInfo.committer,
    committerDate: currentInfo.committerDate,
    commitMessage: currentInfo.commitMessage,
    root: currentInfo.root,
  };
};
