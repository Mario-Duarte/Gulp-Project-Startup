// Gulp
const { watch, series, parallel, src, dest } = require('gulp');

//Scripts requires
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const stripDebug = require('gulp-strip-debug');
const order = require('gulp-order');

//Styles requires
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');

sass.compiler = require('sass');

//Tools and others requires
const fs = require('fs-extra');
const argv = require('minimist')(process.argv.slice(2));
const gulpif = require('gulp-if');
const del = require('del');
const fileSync = require('gulp-file-sync');
const log = require('fancy-log');
const colors = require('ansi-colors');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

// Setup directories object
const dir = {
	input: 'src/',
	get inputScripts() { return this.input + 'scripts/'; },
	get inputStyles() { return this.input + 'scss/'; },
	get inputHtml() { return this.input + 'html/' },
	output: 'build/',
	get outputScripts() { return this.output + 'js/'; },
	get outputStyles() { return this.output + 'css/'; },
	get outputHtml() { return this.output + 'html/' },
}

// Autoprefixer options
const optAutoprefixer = {
	remove: false,
	cascade: false,
	add: true,
	remove: true
}

const templates = {
	html : `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<link rel="stylesheet" href="css/style.css">
			<title>Hello World!</title>
		</head>
		<body>

			<h1>Hello World!</h1>

			<script src="js/app.js"></script>
		</body>
		</html>
	`,
	appJs: `
		const viewport = {
			width : window.innerWidth,
			height : window.innerHeight
		}

		window.addEventListener("resize", () => {
			viewport.width = window.innerWidth;
			viewport.height = window.innerHeight;

			//console.log(viewport);
		});

		document.addEventListener('DOMContentLoaded', (event) => {
			//Initialize you modules here...
		})
	`,
	style: `
		@import "_parts/_base/variables";
		@import "_parts/_mixins/mixins";

		html,
		body {
			padding: 0;
			margin: 0;
		}

		body {
			font-family: Helvetica, sans-serif;
			font-size: 16px;
		}

		body * {
			box-sizing: border-box;
		}

		@import "_parts/_views/views";
	`,
	variables: `
		// Colors
		$primary : magenta;
		$secondary : blue;
		$tertiary : orangered;

		$error : red;
		$success : green;

		$black : black;
		$dark : #555;
		$light : #eee;
		$white : white;
	`,
	mixins: `
		// Import your mixins here
	`,
	views: `
		// Import your views here
	`
}

function help(cb) {
	log(colors.bgBlue.white(`You current source folder is set to: '${dir.input}' and your output to: '${dir.output}'`));
	log(colors.bgBlue.white(`To setup the project folder use the command: 'gulp setup'`));
	log(colors.bgBlue.white(`To build from the src use the command: 'gulp'`));
	log(colors.bgBlue.white(`To sync the files from the src use the command: 'gulp sync'`));
	log(colors.bgBlue.white(`To clear the output folder use the command: 'gulp clean'`));
	log(colors.bgBlue.white(`To watch the files from the src use the command: 'gulp watch'`));
	cb();
}

function setup(cb) {

	log(colors.dim.bgBlue.black(`Setting up the project folders for you...`));
	const dirs = [
		dir.input,
		dir.inputScripts,
		dir.inputScripts + 'modules/',
		dir.inputScripts + 'utils/',
		dir.inputScripts + 'views/',
		dir.inputStyles,
		dir.inputStyles + '_parts/',
		dir.inputStyles + '_parts/_base/',
		dir.inputStyles + '_parts/_mixins/',
		dir.inputStyles + '_parts/_views/',
		dir.inputHtml, dir.inputHtml + 'assets',
		dir.inputHtml + 'assets/images',
		dir.inputHtml + 'assets/scripts',
		dir.inputHtml + 'assets/stylesheets'
	];

	log(colors.dim.bgRed.black(`Creating ${colors.bold.white(dirs.length)} folders in ${colors.bold.white(dir.input)}`));

	for (let i=0; i<dirs.length; i++) {
        const directory = dirs[i];
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            log(colors.bgGreen.black(`Created ${directory} folder successfully!`));
        } else {
            log(colors.bgYellow.black(`Folder ${directory} already exists, no action taken!`));
        }
	}

	if (!fs.existsSync(dir.inputHtml + 'index.html')) {
        fs.outputFile(dir.inputHtml + 'index.html', templates.html, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base index.html file.`));
        });
    } else {
        log(colors.bgYellow.black(`index.html file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputScripts + 'app.js')) {
        fs.outputFile(dir.inputScripts + 'app.js', templates.appJs, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base app.js file.`));
        });
    } else {
        log(colors.bgYellow.black(`app.js file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + 'style.scss')) {
        fs.outputFile(dir.inputStyles + 'style.scss', templates.style, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base style.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`style.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_base/_variables.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_base/_variables.scss', templates.variables, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _variables.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_variables.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_mixins/_mixins.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_mixins/_mixins.scss', templates.mixins, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _mixins.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_mixins.scss file already exists, no action taken!`));
	}

	if (!fs.existsSync(dir.inputStyles + '_parts/_views/_views.scss')) {
        fs.outputFile(dir.inputStyles + '_parts/_views/_views.scss', templates.views, function (err) {
            if (err && err.code != 'EEXIST') return console.error(err)
            log(colors.bgGreen.black(`Created base _views.scss file.`));
        });
    } else {
        log(colors.bgYellow.black(`_views.scss file already exists, no action taken!`));
    }

	cb();
}

function clean(cb) {
	log(colors.dim.bgRed.black(`Cleaning content of '${colors.bold.white(dir.output)}' folders...`));
	del(dir.output);
	cb();
}

function main(cb) {
	// if prod flag is found, change the output folder to 'dist/'
	if (argv.prod) {
		dir.output = 'dist/';
		log(colors.dim.bgRed.black(`You running Gulp in production mode...`));
	}
	log(colors.dim.bgBlue.black(`Your current output is set to: '${dir.output}'`));
	cb();
}

function syncFiles(cb) {
	fileSync(dir.inputHtml, dir.output, {
		recursive: false,
		ignore: ['css/*', 'js/*']
	})
	cb();
}

// Handle the scripts of the project
function scripts(cb) {

	log(colors.dim.bgBlue.black(`Compiling scripts to: '${colors.bold.white(dir.outputScripts)}' folder`));

	return src( dir.inputScripts + '**/*.js')
	.pipe(order([
		"scripts/**/!(app)*.js", //all other js files on folder but not the app.js
		"scripts/app.js" // this should be the the last file to be added so that you can initiate you modules on
	], { base: dir.input }))
	.pipe(babel({
		presets: ['@babel/preset-env']
	}))
	.pipe(concat('app.js'))
	.pipe(gulpif(argv.prod, stripDebug()))
	.pipe(gulpif(argv.prod,minify({
		ext:{
            src:'-debug.js',
            min:'.js'
        }
	})))
	.pipe(dest(dir.outputScripts));
	cb();
}

function styles(cb) {

	log(colors.dim.bgBlue.black(`Compiling styles to: ${colors.bold.white(dir.outputStyles)} folder`));

	return src(dir.inputStyles + '**/*.scss')
	.pipe(gulpif(argv.prod, stripCssComments()))
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer(optAutoprefixer))
	.pipe(dest(dir.outputStyles));
	cb();
}

function watcher(cb) {

	log(colors.dim.bgBlue.black(`Watching for changes on: '${colors.bold.white(dir.input)}' folder`));

	watch(dir.inputScripts + '**/*.js', scripts);
	watch(dir.inputStyles + '**/*.scss', styles);
	watch(dir.inputHtml + '**/*', syncFiles);

	if (argv.live) {
		watch(dir.output, reload);
	}

	cb();
}

if (argv.live) {
	browserSync.init({
		server: {
            baseDir: "./build"
        },
		notify: true
	});
}

exports.help = help;
exports.setup = series(main, setup, parallel(syncFiles,styles, scripts));
exports.default = series(main,parallel(syncFiles,styles, scripts));
exports.sync = syncFiles;
exports.clean = series(clean, syncFiles,styles, scripts);
exports.watch = series(main, parallel(syncFiles,styles, scripts), watcher);
