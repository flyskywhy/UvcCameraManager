var gitRepoInfo = require('git-repo-info');
var package = require('../package.json');
var name = package.name;
var version = package.version;

module.exports = function( /* environment, appConfig */ ) {
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
    root: currentInfo.root
  };
};
