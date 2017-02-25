'use strict';
var fs = require('fs');
var expect = require('chai').expect;
var getBlocks = require('../lib/getBlocks');
var inputsDir = 'test/fixtures/';

describe('Get Blocks', function () {
	it('should get JS block', function () {
		var src = inputsDir + 'js.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content);
		var outcome = [
			{
				async: false,
				defer: false,
				type: 'js',
				dest: 'js/main.js',
				indent: '\t',
				searchPath: ['',],
				src: [
					inputsDir + 'js/foo.js',
					inputsDir + 'js/bar.js',
				],
				raw: [
					'\t<!-- build:js js/main.js -->',
					'\t<script src="js/foo.js"></script>',
					'\t<script src="js/bar.js"></script>',
					'\t<!-- endbuild -->',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});

	it('should get defer and async JS block', function () {
		var src = inputsDir + 'defer-async.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content);
		var outcome = [
			{
				async: true,
				defer: true,
				type: 'js',
				dest: 'js/main.js',
				indent: '\t',
				searchPath: ['',],
				src: [
					inputsDir + 'js/foo.js',
					inputsDir + 'js/bar.js',
				],
				raw: [
					'\t<!-- build:js js/main.js -->',
					'\t<script defer async src="js/foo.js"></script>',
					'\t<script defer async src="js/bar.js"></script>',
					'\t<!-- endbuild -->',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});

	it('should get CSS block', function () {
		var src = inputsDir + 'css.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content);
		var outcome = [
			{
				async: false,
				defer: false,
				type: 'css',
				dest: 'css/main.css',
				indent: '\t',
				searchPath: ['',],
				src: [
					inputsDir + 'css/foo.css',
					inputsDir + 'css/bar.css',
				],
				raw: [
					'\t<!-- build:css css/main.css -->',
					'\t<link rel="stylesheet" href="css/foo.css">',
					'\t<link rel="stylesheet" href="css/bar.css">',
					'\t<!-- endbuild -->',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});

	it('should get livereload script', function () {
		var src = inputsDir + 'livereload.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content, true);
		var outcome = [
			{
				type: 'livereload',
				raw: [
					'\t<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':35729/livereload.js?snipver=1"></\' + \'script>\')</script>',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});

	it('should get JS block with alternate search path', function () {
		var src = inputsDir + 'alt-search-path.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content);
		var outcome = [
			{
				async: false,
				defer: false,
				type: 'js',
				dest: 'js/main.js',
				indent: '\t',
				searchPath: ['alt', 'alt2',],
				src: [
					inputsDir + 'alt/foo.js',
					inputsDir + 'alt/bar.js',
					inputsDir + 'alt2/foobar.js',
				],
				raw: [
					'\t<!-- build:js(alt,alt2) js/main.js -->',
					'\t<script src="foo.js"></script>',
					'\t<script src="bar.js"></script>',
					'\t<script src="foobar.js"></script>',
					'\t<!-- endbuild -->',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});

	it('should get remove block', function () {
		var src = inputsDir + 'remove.html';
		var content = fs.readFileSync(src).toString();
		var blocks = getBlocks(src, content);
		var outcome = [
			{
				async: false,
				defer: false,
				type: 'remove',
				dest: '',
				indent: '\t',
				searchPath: ['',],
				src: [
					inputsDir + 'js/foo.js',
					inputsDir + 'js/bar.js',
				],
				raw: [
					'\t<!-- build:remove -->',
					'\t<script src="js/foo.js"></script>',
					'\t<script src="js/bar.js"></script>',
					'\t<!-- endbuild -->',
				],
			},
		];

		expect(blocks).to.eql(outcome);
	});
});
