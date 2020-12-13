const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	mode: 'none',
	output: {
		path: path.resolve(__dirname, 'tmp'),
		filename: 'main.js',
	},
	module: {
		rules: [
			{
				test: /environment\.ts?$/,
				loader: 'file-replace-loader',
				options: {
					condition: true,
					replacement: path.resolve(__dirname, 'src/environments/environment.staging.ts'),
					async: true,
				},
			},
		],
	},
});
