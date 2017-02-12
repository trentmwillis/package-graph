const fs = require('fs-extra');
const createPackageGraph = require('./lib/create-package-graph');

fs.mkdirpSync('dist');
fs.writeJsonSync('dist/package.graph.json', createPackageGraph());
fs.copySync('node_modules/d3/build/d3.min.js', 'dist/d3.min.js');
