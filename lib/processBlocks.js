'use strict';
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var UglifyJS = require('uglify-js');
var CleanCSS = require('clean-css');

module.exports = function (blocks, destDir, config) {
	blocks.forEach(function (block) {
		var filepath = '';

		if (block.type === 'js') {
			filepath = path.join(destDir, block.dest);

			var js = UglifyJS.minify(block.src, config.uglifyjs);

			mkdirp.sync(path.dirname(filepath));
			fs.writeFileSync(filepath, js.code);

			if (config.uglifyjs.outSourceMap !== null) {
				var mappath = path.join(destDir, path.dirname(block.dest), config.uglifyjs.outSourceMap);

				mkdirp.sync(path.dirname(mappath));
				fs.writeFileSync(mappath, js.map);
			}
		} else if (block.type === 'css') {
			filepath = path.join(destDir, block.dest);
			var css = '';

			block.src.forEach(function (src) {
				css += fs.readFileSync(src);
			});

			css = new CleanCSS(config.cleancss).minify(css).styles;

			mkdirp.sync(path.dirname(filepath));
			fs.writeFileSync(filepath, css);
		} else if (block.type !== 'livereload' && block.type !== 'remove') {
			throw Error('Unsupport format: ' + block.type);
		}
	});

	return true;
};
