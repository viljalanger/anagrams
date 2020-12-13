const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js',
	},
	module: {
		rules: [
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
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
});
