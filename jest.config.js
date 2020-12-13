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
	},
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	coveragePathIgnorePatterns: [
		'/node_modules',
		'test-config',
		'interfaces',
		'jestGlobalMocks.ts',
		'.module.ts',
		'<rootDir>/src/app/main.ts',
		'.mock.ts',
		'models',
		'index.ts',
	],
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 20,
			functions: 30,
			lines: 50,
			statements: 50,
		},
	},
};
