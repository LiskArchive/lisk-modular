const Controller = require('../../../../../src/controller');
const Bus = require('../../../../../src/bus');

jest.mock('../../../../../src/bus');

describe('Controller Class', () => {
	describe('#constructor', () => {
		beforeEach(() => {
			Bus.mockClear();
		});

		it('should initialize the instance correctly when valid arguments were provided.', () => {
			// Arrange
			const config = {
				some: 'key',
			};

			// Act
			const controller = new Controller(config);

			// Assert
			expect(controller.config).toEqual(config);
			expect(controller.modules).toBeObject();
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
		beforeEach(() => {
			Bus.mockClear();
		});

		it('should initialize the instance correctly when valid arguments were provided.', () => {
			// Arrange
			const config = {
				some: 'key',
			};

			// Act
			const controller = new Controller(config);

			// Assert
			expect(controller.config).toEqual(config);
			expect(controller.modules).toBeObject();
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
});
