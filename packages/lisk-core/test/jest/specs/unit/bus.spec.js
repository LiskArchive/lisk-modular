const eventemitter2 = require('eventemitter2');
const Bus = require('../../../../src/bus');
jest.mock('eventemitter2');

describe('Bus Class', () => {
	describe('#constructor', () => {
		beforeEach(() => {});

		afterEach(() => {
			jest.unmock('eventemitter2');
		});

		it('should call constructor of EventEmmiter2 class.', () => {
			// Arrange
			const bus = new Bus({}, { wildcard: true });
			// Act & Assert
			expect(eventemitter2).toHaveBeenCalledTimes(1);
		});
	});
});
