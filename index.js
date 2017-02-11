const fs = require('fs-extra');
const createPackageGraph = require('./lib/create-package-graph');

fs.mkdirpSync('dist');
fs.writeJsonSync('dist/package.graph.json', createPackageGraph());
