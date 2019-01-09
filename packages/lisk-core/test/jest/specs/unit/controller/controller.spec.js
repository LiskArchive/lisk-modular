const Controller = require('../../../../../src/controller');
const Bus = require('../../../../../src/bus');
const fsExtra = require('fs-extra');
const fixtures = require('./fixtures');
// Mocks will be hoisted
jest.mock('../../../../../src/bus');
jest.mock('../../../../../src/helpers/schema');
jest.mock('fs-extra');

describe('Controller Class', () => {
	describe('#constructor', () => {
		it('should initialize the instance correctly without an exception.', () => {
			// Arrange
			const config = fixtures.UNALLOWED_CONFIG;

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
		it('should throw error when an unallowed configuration parameter provided.', async () => {
			// Arrange
			const config = fixtures.UNALLOWED_CONFIG;
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
			const config = fixtures.INVALID_CONFIG;
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
			const config = fixtures.VALID_CONFIG;

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
			const config = fixtures.VALID_CONFIG;

			const controller = new Controller(config);

			// Act
			await controller.setup();

			// Assert
			expect(process.title).toBe(`Lisk ${config.pkg.version} : (${
				config.dirs.root
			})`);
		});

		it('should call Bus.setup() method.', async () => {
			// Arrange
			const config = fixtures.VALID_CONFIG;

			const controller = new Controller(config);

			// Act
			await controller.setup();

			// Assert
			expect(controller.bus.setup).toHaveBeenCalledTimes(1);
		});
	});
});
