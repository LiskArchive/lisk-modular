const eventemitter2 = require('eventemitter2');
const Bus = require('../../../../src/bus');

jest.mock('eventemitter2');

describe('Bus Class', () => {
	describe('#constructor', () => {
		afterEach(() => {
			jest.unmock('eventemitter2');
		});

		it('should call constructor of EventEmmiter2 class.', () => {
			// Act
			// eslint-disable-next-line no-unused-vars
			const bus = new Bus({}, { wildcard: true });
			// Assert
			expect(eventemitter2).toHaveBeenCalledTimes(1);
		});
	});
});
