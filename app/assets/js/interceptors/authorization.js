function AuthorizationInterceptor (baseAPI) {
	return {
		request: function(config) {
			var token = localStorage.getItem('token');

			if (config.url.match(baseAPI) && !config.headers['Authorization'] && token) {
				config.headers['Authorization'] = JSON.parse(token);
			}
			return config;
		}
	};
}

angular
	.module('app')
	.factory('AuthorizationInterceptor', AuthorizationInterceptor);
