
const cli = require('../../../../src/cli');

describe('App', () => {
	it('should run', () => {
		cli.parse(process.argv);
	});
});
