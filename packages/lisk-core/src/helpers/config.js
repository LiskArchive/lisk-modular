const os = require('os');
const configJSON = require('../../config/config.json');
const packageJSON = require('../../package.json');

const runTimeConfig = {
	dirs: {
		root: process.cwd(),
		temp: `${os.homedir()}/.lisk-core/temp`,
		sockets: `${os.homedir()}/.lisk-core/temp/sockets`,
		pids: `${os.homedir()}/.lisk-core/temp/pids`,
		modules: `${process.cwd()}/modules`,
	},
};

module.exports = {
	...configJSON,
	...runTimeConfig,
	pkg: packageJSON,
};
