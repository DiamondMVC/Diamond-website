const { webpack, projectRoot, baseSettings } = require('./webpack.base.js');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

let prodSettings = {
	...baseSettings,
	entry: [
		...baseSettings.entry
	],
	plugins: [
		...baseSettings.plugins,
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.AggressiveMergingPlugin(),
		new webpack.optimize.ModuleConcatenationPlugin(),
	],
	optimization: {
		minimizer: [
			new OptimizeCSSAssetsPlugin({})
		]
	},
};

module.exports = prodSettings;
