const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'none',
	target: 'node',
	entry: {
		app: path.resolve(__dirname, 'src/main.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [{ from: path.join(__dirname, 'assets/**/*'), to: './' }],
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /environment\.ts?$/,
				loader: 'file-replace-loader',
				options: {
					condition: true,
					replacement: path.resolve(__dirname, 'src/environments/environment.prod.ts'),
					async: true,
				},
			},
		],
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin()],
		extensions: ['.tsx', '.ts', '.js'],
		fallback: { constants: false },
	},
};
