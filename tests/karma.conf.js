module.exports = function(config) {
	var wiredep = require('wiredep'),
		bowerFiles = wiredep({devDependencies: true}).js;

	config.set({

		basePath: '../',

		files: bowerFiles.concat([
			'app/assets/js/app.js',
			'tests/doubles/*.js',
			'tests/unit/*.js'
		]),

		autoWatch: true,

		frameworks: ['jasmine'],

		browsers: ['Chrome'],

		plugins: [
			'karma-chrome-launcher',
			'karma-jasmine',
			'karma-junit-reporter'
		],

		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		}

	});
};
