const Controller = require('../../../../../src/controller');
// const Bus = require('../../../../../src/lib/Bus');
// const fsExtra = require('fs-extra');
const fixtures = require('./fixtures');
// Mocks will be hoisted
// jest.mock('../../../../../src/lib/Bus');
jest.mock('../../../../../src/helpers/schema');
// jest.mock('fs-extra');

describe('Controller Class', () => {
	describe('#constructor', () => {
		it('should initialize the instance correctly without an exception.', async () => {
			// Arrange
			const config = fixtures.UNALLOWED_CONFIG;

			// Act
			const controller = new Controller();
			await controller.init(config);

			// Assert
			expect(controller.config).toEqual(config);
			expect(controller.modules).toBeArray();
			expect(controller.channel).toBeNull();
			// expect(controller.bus).toBeInstanceOf(Bus);

			// Not needed
			/**
				expect(Bus)
					.toHaveBeenCalledTimes(1)
					.toHaveBeenCalledWith(controller, {
						wildcard: true,
						delimiter: ':',
						maxListeners: 1000,
					});
			*/
		});
	});

	describe('#setup', () => {
		it('should throw error when an unallowed configuration parameter provided.', async () => {
			// Arrange
			const config = fixtures.UNALLOWED_CONFIG;
			const controller = new Controller();
			await controller.init(config);

			// Act & Assert
			expect(controller.setup()).rejects.toThrow(Error);
			// expect(controller.setup()).rejects.toThrow('Configuration validation failed!');
		});

		it('should throw error when an invalid configuration parameter provided.', async () => {
			// Arrange
			const config = fixtures.INVALID_CONFIG;
			const controller = new Controller();
			await controller.init(config);

			// Act & Assert
			expect(controller.setup()).rejects.toThrow(Error);
		});

		/**
			it('should make sure all directories exist.', async () => {
				// Arrange
				const config = fixtures.VALID_CONFIG;
				const controller = new Controller();
				await controller.init(config);

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
		*/

		it('should make sure all directories exist.', async () => {
			// Arrange
			const config = fixtures.VALID_CONFIG;
			const controller = new Controller();
			await controller.init(config);
			const spy = jest.spyOn(controller, 'prepareWorkspace');

			// Act
			await controller.setup();

			// Assert
			return expect(spy)
				.toHaveBeenCalledTimes(1);
		});

		it('should set process title.', async () => {
			// Arrange
			const config = fixtures.VALID_CONFIG;
			const controller = new Controller();
			await controller.init(config);

			// Act
			await controller.setup();

			// Assert
			expect(process.title).toBe(`Lisk ${config.pkg.version} : (${
				config.dirs.root
			})`);
		});

		/**
			it('should call Bus.setup() method.', async () => {
				// Arrange
				const config = fixtures.VALID_CONFIG;
				const controller = new Controller();
				await controller.init(config);

				// Act
				await controller.setup();

				// Assert
				expect(controller.bus.setup).toHaveBeenCalledTimes(1);
			});
		*/
	});
});
