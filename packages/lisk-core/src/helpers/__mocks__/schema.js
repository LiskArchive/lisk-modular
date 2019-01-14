module.exports = {
	setup: jest.fn().mockResolvedValue(true),
	validate: jest.fn().mockReturnValue([]),
	sanitizeErrorMessages: jest.fn().mockReturnValue(''),
};
