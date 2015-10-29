exports.config = {
	allScriptsTimeout: 11000,

	specs: [
		'e2e/*.js'
	],

	capabilities: {
		browserName: 'chrome'
	},

	baseUrl: 'http://localhost:9000',

	seleniumAddress:'http://127.0.0.1:4444/wd/hub',

	framework: 'jasmine2',

	plugins: [{
		chromeA11YDevTools: true,
		path: require.resolve('protractor/plugins/accessibility/index.js')
	}],

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};
