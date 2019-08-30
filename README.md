# Fast Project Startup with Gulp

Hit the ground running with this project startup with all the tools you need to start developing web pages in time.
*I developed this to help me save time, and this tool was built with my workflow in mind so feel free to modify it to fit your workflow needs

## Dependencies

- [nodejs](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [gulp](https://gulpjs.com/)
- [sass](https://sass-lang.com/dart-sass)

## Installation

To install this just run `git clone https://github.com/Mario-Duarte/Gulp-Project-Startup.git` followed by `cd Gulp-Project-Startup`, once you are at the root directory of you project just run `npm install` to install all dependencies.

## Setup

After the installation process is done you can go ahead and run `gulp setup`, this will perform the following:

- set up working tree
- create base template files
- run the compilers for the first time

Running the command with the `--prod` flag will run the same as the above but compile all the code to the set production folder.

### Tree structure

The setup process will generate the following tree structure:
```
	├── Root
	|	├── dist (if ran with --prod flag)
	|	|	├── css
	|	|	|	└── style.css
	|	|	├── js
	|	|	|	└── app.js
	|	|	└── index.html
	|	├── build
	|	|	├── css
	|	|	|	└── style.css
	|	|	├── js
	|	|	|	└── app.js
	|	|	└── index.html
	|	├── src
	|	|	├── html
	|	|	|	├── assets
	|	|	|	|	├── images
	|	|	|	|	├── scripts (scripts vendor folder)
	|	|	|	|	└── stylesheets (styles vendor folder)
	|	|	|	└── index.html
	|	|	├── scripts
	|	|	|	├── modules
	|	|	|	├── utils
	|	|	|	├── views
	|	|	|	└── app.js
	|	|	├── scss
	|	|	|	├── _parts
	|	|	|	|	├── _base
	|	|	|	|	|	└── _variables.scss
	|	|	|	|	├── _mixins
	|	|	|	|	|	└── _mixins.scss
	|	|	|	|	├── _views
	|	|	|	|	|	└── _views.scss
	|	|	|	|	└── style.scss
	|	├── .browserlistrc
	|	├── .editorconfig
	|	├── .gitignore
	|	├── Gulpfile.js
	|	├── Package-json
	|	└── README.md
```

https://editorconfig.org/
