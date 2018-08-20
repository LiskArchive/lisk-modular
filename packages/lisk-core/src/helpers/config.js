const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const configJSON = require('../../config/config.json');
const packageJSON = require('../../package.json');

let { modulesDir } = configJSON;

if (modulesDir) {
	// Get relative path
	const relativeModulesDir = path.resolve(
		// Path for executable liskctrl
		path.dirname(process.argv[1]),
		configJSON.modulesDir,
	);

	// Get absolute path if relative not exists
	if (fs.existsSync(relativeModulesDir)) {
		modulesDir = relativeModulesDir;
	}
}

const runTimeConfig = {
	dirs: {
		root: process.cwd(),
		temp: `${os.homedir()}/.lisk-core/temp`,
		sockets: `${os.homedir()}/.lisk-core/temp/sockets`,
		pids: `${os.homedir()}/.lisk-core/temp/pids`,
		modules: modulesDir,
	},
};

module.exports = {
	...configJSON,
	...runTimeConfig,
	pkg: packageJSON,
};
