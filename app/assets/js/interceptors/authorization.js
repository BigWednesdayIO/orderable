function AuthorizationInterceptor (API) {
	return {
		request: function(config) {
			if (config.url.match(API.base_search)) {
				config.headers['Authorization'] = 'Bearer NG0TuV~u2ni#BP|';
			}
			return config;
		}
	};
}

angular
	.module('app')
	.factory('AuthorizationInterceptor', AuthorizationInterceptor);
