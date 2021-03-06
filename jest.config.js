module.exports = {
	displayName: 'anagrams',
	roots: ['<rootDir>'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
	},
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	modulePaths: ['<rootDir>', '<rootDir>/src/'],
	moduleNameMapper: {
		'@anagrams/models': ['src/models/index.ts'],
		'@anagrams/services': ['src/services/index.ts'],
		'@anagrams/utils': ['src/utils/index.ts'],
		'@anagrams/environment': ['src/environments/index.ts'],
		'@anagrams/injector': ['src/injector/index.ts'],
		'@anagrams/factories': ['src/factories/index.ts'],
	},
	coverageDirectory: 'coverage',
};
