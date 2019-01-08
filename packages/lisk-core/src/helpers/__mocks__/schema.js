module.exports = {
	setup: jest.fn().mockResolvedValue(true),
	validate: jest.fn().mockReturnValue([]),
	getSchema: jest.fn().mockReturnValue({ config: {} }),
	sanitizeErrorMessages: jest.fn().mockReturnValue(''),
};
