const axon = require('axon');
const rpc = require('axon-rpc');
const Bus = require('../../../../src/bus');
const config = require('../../../../src/helpers/config');

describe('Bus Class', () => {
	describe('#constructor', () => {
		let busRpcSocket;
		afterEach(() => {
			busRpcSocket.close();
		});

		it('should expose registerChannel on rpcServer.', async done => {
			// Arrange
			busRpcSocket = axon.socket('req');
			const busRpcSocketPath = `unix://${config.dirs.sockets}/bus_rpc.sock`;
			const busRpcClient = new rpc.Client(busRpcSocket);

			// Act
			const bus = new Bus({},	{
				wildcard: true,
				maxListeners: 1000,
			});

			await bus.setup();
			busRpcSocket.connect(busRpcSocketPath, () => {});

			// Assert
			busRpcClient.call(
				'registerChannel',
				'testChannel',
				['testEvent'],
				['testAction'],
				{},
				(err) => {
					expect(err).toBeNull();
					expect(bus.getEvents()).toContain('testChannel:testEvent');
					expect(bus.getActions()).toContain('testChannel:testAction');
					done();
				},
			);
		});
	});
});
