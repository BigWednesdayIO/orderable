function InterceptorsConfig ($httpProvider) {
	$httpProvider.interceptors.push(
		'BasicValidationInterceptor'
	);
}

angular
	.module('app')
	.config(InterceptorsConfig);
