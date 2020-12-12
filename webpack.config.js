const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'none',
	target: 'node',
	entry: {
		app: resolve(__dirname, 'src/main.ts'),
	},
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'main.js',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{ from: resolve(__dirname, 'assets/**/*.*'), to: './assets' }],
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: [/node_modules/, /\.spec.tsx?$/],
			},
		],
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin()],
		modules: [resolve(__dirname, 'node_modules'), 'node_modules'],
		extensions: ['.ts', '.js'],
		fallback: { constants: false },
	},
};
