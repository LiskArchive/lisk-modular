const Controller = require('../../../../../src/controller');
const Bus = require('../../../../../src/bus');
const fsExtra = require('fs-extra');

// Mocks will be hoisted
jest.mock('../../../../../src/bus');
jest.mock('../../../../../src/helpers/schema');
jest.mock('fs-extra');

describe('Controller Class', () => {
	describe('#constructor', () => {
		it('should initialize the instance correctly when valid arguments were provided.', () => {
			// Arrange
			const config = {
				some: 'key',
			};

			// Act
			const controller = new Controller(config);

			// Assert
			expect(controller.config).toEqual(config);
			expect(controller.modules).toBeArray();
			expect(controller.channel).toBeNull();
			expect(controller.bus).toBeInstanceOf(Bus);

			// Not needed
			expect(Bus)
				.toHaveBeenCalledTimes(1)
				.toHaveBeenCalledWith(controller, {
					wildcard: true,
					delimiter: ':',
					maxListeners: 1000,
				});
		});
	});

	describe('#setup', () => {
		it('should throw error when an undefined configuration parameter provided.', async () => {
			// Arrange
			const config = {
				some: 'key',
			};
			const controller = new Controller(config);

			try {
				// Act
				await controller.setup();
			} catch (err) {
				// Assert
				expect(err).toBeInstanceOf(Error);
				// expect(err.message).toBe('Configuration validation failed!');
			}
		});

		it('should throw error when an invalid configuration parameter provided.', async () => {
			// Arrange
			const config = {
				modulesDir: false,
			};
			const controller = new Controller(config);

			try {
				// Act
				await controller.setup();
			} catch (err) {
				// Assert
				expect(err).toBeInstanceOf(Error);
				// expect(err.message).toBe('Configuration validation failed!');
			}
		});

		it('should make sure all directories exist.', async () => {
			// Arrange
			const config = {
				pkg: {
					version: 'dummyVersion',
				},
				dirs: {
					root: 'rootFolder',
					temp: 'tempFolder',
					pids: 'pidsFolder',
				},
			};

			const controller = new Controller(config);

			// Act
			await controller.setup();

			// Assert
			expect(fsExtra.ensureDirSync)
				.toHaveBeenCalledTimes(3);

			expect(fsExtra.emptyDirSync)
				.toHaveBeenCalledTimes(1)
				.toHaveBeenCalledWith(config.dirs.temp);

			expect(fsExtra.writeFileSync)
				.toHaveBeenCalledTimes(1)
				.toHaveBeenCalledWith(`${config.dirs.pids}/controller.pid`, process.pid);
		});


		it('should set process title.', async () => {
			// Arrange
			const config = {
				pkg: {
					version: 'dummyVersion',
				},
				dirs: {
					root: 'rootFolder',
				},
			};

			const controller = new Controller(config);

			// Act
			await controller.setup();


			expect(fsExtra.emptyDirSync).toHaveBeenCalledTimes(1);
			// Assert
			expect(process.title).toBe(`Lisk ${config.pkg.version} : (${
				config.dirs.root
			})`);
		});
	});
});
