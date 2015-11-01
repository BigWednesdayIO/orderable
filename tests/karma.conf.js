module.exports = function(config) {
	var wiredep = require('wiredep'),
		bowerFiles = wiredep({devDependencies: true}).js;

	config.set({

		basePath: '../',

		files: bowerFiles.concat([
			'app/assets/js/app.js',
			'tests/doubles/*.js',
			'tests/unit/*.js',
			'app/views/**/*.html',
			'app/assets/images/icons/*.svg'
		]),

		autoWatch: true,

		frameworks: ['jasmine'],

		browsers: ['Chrome'],

		plugins: [
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-ng-html2js-preprocessor'
		],

		preprocessors: {
			'app/views/**/*.html': ['ng-html2js'],
			'app/assets/images/icons/*.svg': ['ng-html2js']
		},

		ngHtml2JsPreprocessor: {
			stripPrefix: 'app/',
			moduleName: 'htmlTemplates'
		},

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
