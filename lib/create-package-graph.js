const fs = require('fs-extra');
const findUp = require('find-up');
const path = require('path');

const nodeList = Object.create(null);

function findNearestPackage(cwd) {
  let packagePath = findUp.sync('package.json', { cwd });
  return fs.readJsonSync(packagePath);
}

function initNode(package, options = {}) {
  let id = `${package.name}@${package.version}`;

  if (nodeList[id]) {
    return nodeList[id];
  }

  let node = nodeList[id] = {
    id,
    dependencies: []
  };

  let deps = Object.keys(package.dependencies || {});

  if (options.includeDevDeps) {
    let devDeps = Object.keys(package.devDependencies || {});
    node.devDependencies = [];

    for (let i = 0; i < devDeps.length; i++) {
      let dep = devDeps[i];
      let depPath = path.dirname(require.resolve(dep));
      let depPackage = findNearestPackage(depPath);

      let depNode = initNode(depPackage);

      node.devDependencies.push(depNode.id);
    }
  }

  // TODO: Do stuff for ember addons

  for (let i = 0; i < deps.length; i++) {
    let dep = deps[i];
    let depPath = path.dirname(require.resolve(dep));
    let depPackage = findNearestPackage(depPath);

    let depNode = initNode(depPackage);

    node.dependencies.push(depNode.id);
  }

  return node;
}

module.exports = function createPackageGraph() {
  let startingPackage = findNearestPackage(process.cwd());
  let rootNode = initNode(startingPackage, {
    includeDevDeps: true
  });

  rootNode.isRoot = true;

  return nodeList;
}
