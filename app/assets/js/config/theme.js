function ThemeConfig ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('green', {
			default: '600'
		})
		.accentPalette('grey');
}

angular
	.module('app')
	.config(ThemeConfig);
