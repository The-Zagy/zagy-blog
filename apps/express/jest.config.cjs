/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	transform: {},
	moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
	modulePathIgnorePatterns: ['node_modules'],
};
