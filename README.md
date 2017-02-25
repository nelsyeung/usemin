# usemin [![Build Status](https://travis-ci.org/nelsyeung/usemin.svg?branch=master)](https://travis-ci.org/nelsyeung/usemin)

> API version of usemin. For _purists_, those who doesn't use build tools like [Grunt](https://github.com/yeoman/grunt-usemin) and [Gulp](https://github.com/zont/gulp-usemin), but just use node as their build tool.

## Getting started

Install with npm:
```sh
npm install usemin
```

## CLI
[usemin-cli](https://github.com/nelsyeung/usemin-cli) - Command line interface for this module.

## API
```js
var usemin = require('usemin');
```

### usemin(filepath, dest, [opts])
Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).

#### Parameters:
*(string)* **filepath** - HTML input file path.

*(string)* **dest** - Directory for where the optimized scripts and stylesheets should go.

*(object)* **opts** *Optional* - See below for the available options.

#### Returns:
*(string)* The content of the final HTML file

#### options:
```js
var defaults = {
	output: false, // HTML output path. If false, it will be printed to the console (string)
	configFile: false, // config file path for UglifyJS, CleanCSS and HTML minifier (string)
	htmlmin: false, // Whether to minify the input HTML file (Boolean)
	noprocess: false, // Do not process files, just replace references (Boolean)
	removeLivereload: false, // Remove livereload script (Boolean)
};
```

#### Examples
```js
var html = usemin('src/index.html', 'dist');
usemin('src/index.html', 'dist', {
	output: 'dist/index.html',
	htmlmin: true,
	removeLivereload: true,
});
```

### usemin.getBlocks(filepath, content, removeLivereload)
Extract information from a HTML input file to be processed later. This does not process any files
(i.e., it doesn't perform uglify or minify).

#### Parameters:
*(string)* **filepath** - HTML input file path.

*(string)* **content** - Content of the HTML file as a string. (The reason for this is because the
main usemin function uses this content multiple times, so to prevent the file being read multiples
times it's simply cached into a variable to be passed into these API functions.)

*(boolean)* **removeLivereload** - Whether to also extract livereload script.

#### Returns:
**(object)** An object of the following form:
```js
[
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
]
```

### usemin.getConfig(configFile)
Returns configurations object for UglifyJS, CleanCSS and HTML minifier from a config file.

#### Parameters:
*(string)* **configFile** - Config file path. (.js extension can be omitted.)

#### returns:
**(object)** An object of the following form:
```js
{
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
}
```

### usemin.processBlocks(blocks, dest, config)
Uglify javascripts and CSS for a supplied block object from the `usemin.getBlocks` function.

#### Parameters:
*(object[])* **blocks** - Blocks from the `usemin.getBlocks` function.

*(string)* **dest** - Directory for where the optimized scripts and stylesheets should go.

*(object)* **config** - Configuration object for UglifyJS, cleanCSS and HTML minifier.

#### Returns:
*(boolean)* Throws error, otherwise true.

### usemin.getHtml(content, blocks, htmlmin, config)
Returns the HTML with replaced references to non-optimized scripts or stylesheets.

#### Parameters:
*(string)* **content** - Content of the HTML file as a string. (The reason for this is because the
main usemin function uses this content multiple times, so to prevent the file being read multiples
times it's simply cached into a variable to be passed into these API functions.)

*(object[])* **blocks** - Blocks from the `usemin.getBlocks` function.

*(boolean)* **htmlmin** - Whether to also minify the HTML.

*(object)* **config** - Configuration object for UglifyJS, cleanCSS and HTML minifier.

#### Returns:
*(string)* The content of the final HTML file

### Example HTML
#### Blocks
Blocks are expressed as:
```html
<!-- build:<pipelineId>(alternate search path) <path> -->
... HTML Markup, list of script / link tags.
<!-- endbuild -->
```

- **pipelineId**: pipeline id for options or remove to remove a section
- **alternate search path**: (optional) By default the input files are relative to the treated file. Alternate search path allows one to change that
- **path**: the file path of the optimized file, the target output

```html
<!-- build:css css/main.js -->
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/modules.css">
<!-- endbuild -->

<!-- build:js js/main.js -->
<script src="js/app.js"></script>
<script src="js/controllers.js"></script>
<!-- endbuild -->

<!-- build:js js/main.js -->
<script defer async src="js/app.js"></script>
<script defer async src="js/controllers.js"></script>
<!-- endbuild -->

<!-- build:remove -->
<script src="js/app.js"></script>
<script src="js/controllers.js"></script>
<!-- endbuild -->

<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>
```
Running the command with `--rmlr true` will output:
```
<link rel="stylesheet" href="css/main.js">
<script src="js/main.js"></script>
<script defer async src="js/main.js"></script>
```

#### Alternate search path
```html
<!-- build:js(js) js/main.js -->
<script defer async src="app.js"></script>
<script defer async src="controllers.js"></script>
<!-- endbuild -->

<!-- build:js(js,.tmp) js/main.js -->
<script defer async src="app.js"></script>
<script defer async src="controllers.js"></script>
<!-- endbuild -->
```

### Config file

Please check the relevant documentations for the available options: [UglifyJS](https://github.com/mishoo/UglifyJS2), [CleanCSS](https://github.com/jakubpawlowicz/clean-css) and [HTML minifier](https://github.com/kangax/html-minifier).

```JavaScript
module.exports = {
	uglifyjs: {
		// ... UglifyJS API options
	},
	cleancss: {
		// ... CleanCSS API options
	},
	htmlminifier: {
		// ... HTML minifier API options
	}
}
```

## License

[MIT license](http://opensource.org/licenses/MIT.php)
