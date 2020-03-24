const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	configureWebpack: {
		entry: {
			app: "./client/src/main.js",
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.join('client/public', 'index.html'),
				filename: 'index.html'
			})]

	},
	outputDir: 'client/dist',
}