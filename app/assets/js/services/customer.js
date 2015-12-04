function CustomerService ($rootScope, $http, API, browserStorage) {
	var service = this;
	var customerInfo;

	function storeCustomerInfo (info) {
		customerInfo = info;
		browserStorage.setItem('customer_id', info.id);
		browserStorage.setItem('token', info.token);
		return info;
	}

	service.getInfo = function() {
		var id;

		if (customerInfo) {
			return $q.when(customerInfo);
		}

		id = browserStorage.getItem('customer_id');

		if (!id) {
			return $q.when(false);
		}

		return $http({
			method: 'GET',
			url: API.customers + '/' + id,
			headers: {
				Authorization: service.getSessionInfo().token
			}
		});
	};

	service.getSessionInfo = function() {
		return {
			id: (customerInfo || {}).id || browserStorage.getItem('customer_id'),
			token: (customerInfo || {}).token || browserStorage.getItem('token')
		};
	};

	service.isSignedIn = function() {
		var sessionInfo = service.getSessionInfo();
		return true && sessionInfo.id && sessionInfo.token;
	};

	service.register = function(details) {
		$http({
			method: 'POST',
			url: API.customers,
			data: details
		})
			.then(function() {
				return service
					.signIn({
						email: details.email,
						password: details.password
					});
			});
	};

	service.signIn = function(credentials) {
		$http({
			method: 'POST',
			url: API.customers + '/authenticate',
			data: credentials
		})
			.then(storeCustomerInfo)
			.then(function(response) {
				$rootScope.$emit('userSignIn', response);
				return response;
			});
	};
}

angular
	.module('app')
	.service('customerService', CustomerService);
