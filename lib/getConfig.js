'use strict';
module.exports = function (configFile, configOverride) {
	// Default configurations
	var config = {
		uglifyjs: {
		},
		cleancss: {
		},
		htmlminifier: {
			removeComments: true,
			collapseWhitespace: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			minifyJS: true,
			minifyCSS: true,
		},
	};

	if (configFile) {
		var content = require(process.cwd() + '/' + configFile);

		if (content.uglifyjs) {
			config.uglifyjs = content.uglifyjs;
		}

		if (content.cleancss) {
			config.cleancss = content.cleancss;
		}

		if (content.htmlminifier) {
			config.htmlminifier = content.htmlminifier;
		}
	}

	if (configOverride) {
		if (configOverride.uglifyjs) {
			config.uglifyjs = Object.assign(config.uglifyjs, configOverride.uglifyjs);
		}

		if (configOverride.cleancss) {
			config.cleancss = Object.assign(config.cleancss, configOverride.cleancss);
		}

		if (configOverride.htmlminifier) {
			config.htmlminifier = Object.assign(config.htmlminifier, configOverride.htmlminifier);
		}
	}

	return config;
};
