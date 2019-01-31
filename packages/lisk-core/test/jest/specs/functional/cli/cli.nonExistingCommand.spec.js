/**
 * Recommended:
 *
 * 1. Each **functional test file** should contain only one application instance instantiation
 * 		to isolate test scenarios.
 * 2. In **functional test file**, application instantantion must be done in "beforeAll" block.
 * 3. Do not try to test multiple scenarios in a single test file.
 */


const { spawn } = require('child_process');
const path = require('path');

const bin = path.join(__dirname, '../../../../../bin/liskctrl');

describe('Command Line Tool', () => {
	let proc;
	let output;

	beforeAll(done => {
		// Arrange && Act
		output = '';
		proc = spawn(bin, ['non-existent']); // Act
		proc.stdout.on('data', (data) => {
			output += data.toString();
		});
		setTimeout(done, 100);
	});

	afterAll(() => {
		proc.kill('SIGTERM');
	});

	it('should output empty when non-existent command provided', () => {
		// Assert
		expect(output).toBe('');
	});
});
