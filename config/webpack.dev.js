const { webpack, projectRoot, baseSettings } = require('./webpack.base.js');

let devSettings = {
	...baseSettings,
	entry: [
		...baseSettings.entry
	],
	plugins: [
		...baseSettings.plugins,
		// new webpack.HotModuleReplacementPlugin(),
		// new webpack.NamedModulesPlugin(),
	],
};

module.exports = devSettings;
