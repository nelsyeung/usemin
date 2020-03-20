'use strict';
var path = require('path');
var fs = require('fs');

module.exports = function (src, content, removeLivereload) {
	var buildReg = /<!--\s*build:(\w+)(?:(?:\(([^)]+?)\))?\s+(\/?([^\s]+?))?)?\s*-->/;
	var endReg = /<!--\s*endbuild\s*-->/;
	var livereloadReg = /<script(.*?)livereload\.js(.*?)<\/script>/;

	var lines = content.replace(/\r\n/g, '\n').split(/\n/);
	var inBlock = false;
	var block;
	var blocks = [];
	var srcDir = path.dirname(src);

	lines.forEach(function (l) {
		var indent = (l.match(/^\s*/) || [])[0];
		var build = l.match(buildReg);
		var endbuild = endReg.test(l);
		var livereload = livereloadReg.test(l);

		if (build) {
			inBlock = true;
			block = {
				type: build[1],
				dest: (build[3]) ? build[3] : '',
				indent: indent,
				searchPath: ['',],
				src: [],
				raw: [],
			};

			if (build[2]) {
				block.searchPath = build[2].split(',');
			}
		}

		if (removeLivereload && livereload) {
			blocks.push({
				type: 'livereload',
				raw: [l,],
			});
		}

		// Switch back block flag when endbuild
		if (inBlock && endbuild) {
			block.raw.push(l);
			blocks.push(block);
			inBlock = false;
		}

		if (inBlock) {
			var asset = l.match(/(href|src)=["']([^'"]+)["']/);

			if (asset && asset[2]) {
				var numSearchPath = block.searchPath.length;

				for (var i = 0; i < numSearchPath; i++) {
					var assetPath = path.join(srcDir, block.searchPath[i], asset[2]);

					try {
						fs.accessSync(assetPath, fs.F_OK);
						block.src.push(assetPath);
						break;
					} catch (e) {
						continue;
					}
				}

				// Preserve defer attribute
				var defer = / defer/.test(l);
				if (defer && block.defer === false || block.defer && !defer) {
					throw Error('You are not supposed to mix deferred and non-deferred scripts in one block.');
				} else if (defer) {
					block.defer = true;
				} else {
					block.defer = false;
				}

				// Preserve async attribute
				var async = / async/.test(l);
				if (async && block.async === false || block.async && !async) {
					throw Error('You are not supposed to mix asynced and non-asynced scripts in one block.');
				} else if (async) {
					block.async = true;
				} else {
					block.async = false;
				}

				// Don't support RequireJS
				if (l.match(/data-main=['"]([^'"]+)['"]/)) {
					throw Error('Require.js blocks are not supported.');
				}
			}
			block.raw.push(l);
		}
	});

	return blocks;
};
