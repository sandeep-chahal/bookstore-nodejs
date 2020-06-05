const path = require("path");

module.exports = (dirname) => (relPath) =>
	path.join(dirname, ...relPath.split("/"));
