function AuthorizationInterceptor (baseAPI) {
	return {
		request: function(config) {
			if (config.url.match(baseAPI)) {
				config.headers['Authorization'] = 'Bearer NG0TuV~u2ni#BP|';
			}
			return config;
		}
	};
}

angular
	.module('app')
	.factory('AuthorizationInterceptor', AuthorizationInterceptor);
