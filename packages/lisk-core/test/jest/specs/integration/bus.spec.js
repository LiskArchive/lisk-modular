const Bus = require('../../../../src/bus');
const ChildProcessChannel = require('../../../../src/channels/child_process');

describe('Registering Channels', () => {
	describe('when Bus was constructed', () => {
		let bus;
		let channel;

		afterEach(() => {
			bus.rpcSocket.close();
			channel.rpcSocket.close();
		});

		it('should expose registerChannel method.', async (done) => {
			// Arrange
			bus = new Bus({},	{
				wildcard: true,
				maxListeners: 1000,
			});
			await bus.setup();
			channel = new ChildProcessChannel(
				'testChannel',
				['testEvent'],
				['testAction'],
			);

			// Act
			await channel.registerToBus();

			// Assert
			expect(bus.getEvents()).toContain('testChannel:testEvent');
			expect(bus.getActions()).toContain('testChannel:testAction');
			done();
		});
	});
});
