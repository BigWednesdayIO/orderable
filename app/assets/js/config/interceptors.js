function InterceptorsConfig ($httpProvider) {
	$httpProvider.interceptors.push(
		'BasicValidationInterceptor',
		'AuthorizationInterceptor'
	);
}

angular
	.module('app')
	.config(InterceptorsConfig);
