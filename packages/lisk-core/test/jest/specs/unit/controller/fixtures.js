module.exports = Object.freeze({
	UNALLOWED_CONFIG: {
		some: 'key',
	},
	INVALID_CONFIG: {
		modulesDir: false,
	},
	VALID_CONFIG: {
		pkg: {
			version: 'dummyVersion',
		},
		dirs: {
			root: 'rootFolder',
			temp: 'tempFolder',
			pids: 'pidsFolder',
		},
	},
});

