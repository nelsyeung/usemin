'use strict';
var expect = require('chai').expect;
var getConfig = require('../lib/getConfig');
var inputsDir = 'test/fixtures/';

describe('Get Config', function () {
	it('should get configurations from file', function () {
		var src = inputsDir + 'config';
		var config = getConfig(src);
		var outcome = {
			uglifyjs: {
				outSourceMap: 'minified.js.map',
				warnings: true,
				mangle: true,
				compress: {
					loops: true,
					unused: true,
				},
			},
			cleancss: {
				advanced: true,
				keepBreaks: true,
				rebase: false,
			},
			htmlminifier: {
				removeComments: true,
				collapseWhitespace: true,
				removeEmptyAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				minifyJS: false,
				minifyCSS: false,
			},
		};

		expect(config).to.eql(outcome);
	});

	it('should use default configurations when no file is supplied', function () {
		var config = getConfig(false);
		var outcome = {
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

		expect(config).to.eql(outcome);
	});

	it('should override configurations when configOverride is supplied', function () {
		var src = inputsDir + 'config';
		var config = getConfig(src, {
			uglifyjs: {
				outSourceMap: 'foo.js.map',
			},
			cleancss: {
				advanced: false,
			},
			htmlminifier: {
				removeComments: false,
			},
		});
		var outcome = {
			uglifyjs: {
				outSourceMap: 'foo.js.map',
				warnings: true,
				mangle: true,
				compress: {
					loops: true,
					unused: true,
				},
			},
			cleancss: {
				advanced: false,
				keepBreaks: true,
				rebase: false,
			},
			htmlminifier: {
				removeComments: false,
				collapseWhitespace: true,
				removeEmptyAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				minifyJS: false,
				minifyCSS: false,
			},
		};

		expect(config).to.eql(outcome);
	});
});
