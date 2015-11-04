function BasicValidationInterceptor ($q, $log) {
	function handleResponseError (response) {
		var error = (response.data && typeof response.data === 'object') ? response.data : {};

		if (!error.status) {
			error.status = response.status;
		}

		if (!error.message) {
			error.message = 'An unknown error occurred';
		}

		if (error.status === 401) {
			$state.go('login');
		} else {
			$log.error('API Call failed:', (response.config || {}).url, error.status, '-', error.message);
		}

		return $q.reject(error);
	}

	return {
		response: function(response) {
			var headers = response.headers();

			if ((headers['content-type'] || '').match('application/json') || response.config.url.match(/.+\.json$/)) {
				if ((!response.data || typeof response.data !== 'object') && response.status !== 204) {
					return $q.reject(handleResponseError(response));
				}
				return $q.when(response.data);
			}
			return $q.when(response);
		},
		responseError: handleResponseError
	};
}

angular
	.module('app')
	.factory('BasicValidationInterceptor', BasicValidationInterceptor);
