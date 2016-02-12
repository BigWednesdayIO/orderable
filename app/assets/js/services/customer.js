function CustomerService ($rootScope, $mdToast, $http, $q, API, browserStorage) {
	var service = this;
	var customerInfo;
	var sessionInfo;

	function storeCustomerInfo (info) {
		sessionInfo = {
			id: info.id,
			token: info.token
		};
		browserStorage.setItem('customer_id', info.id);
		browserStorage.setItem('token', info.token);
		return info;
	}

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
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

		return service
			.getUpToDateInfo();
	};

	service.getUpToDateInfo = function() {
		return $http({
			method: 'GET',
			url: API.customers + '/' + service.getSessionInfo().id,
			headers: {
				Authorization: service.getSessionInfo().token
			}
		})
		.then(function(info) {
			customerInfo = info;
			return info;
		});
	};

	service.updateInfo = function(updates) {
		var session = service.getSessionInfo();

		return service
			.getInfo()
			.then(function(serverInfo) {
				delete serverInfo.id;
				delete serverInfo._metadata;

				return $http({
					method: 'PUT',
					url: API.customers + '/' + session.id,
					data: angular.extend(serverInfo, updates),
					headers: {
						Authorization: session.token
					}
				});
			})
			.then(function(updatedInfo) {
				customerInfo = updatedInfo;
				return updatedInfo;
			});
	};

	service.getSessionInfo = function() {
		return {
			id: (sessionInfo || {}).id || browserStorage.getItem('customer_id'),
			token: (sessionInfo || {}).token || browserStorage.getItem('token')
		};
	};

	service.isSignedIn = function() {
		var sessionInfo = service.getSessionInfo();
		return sessionInfo.id && sessionInfo.token && true;
	};

	service.register = function(details) {
		return $http({
			method: 'POST',
			url: API.customers,
			data: details
		})
			.catch(notifyError)
			.then(function() {
				return service
					.signIn({
						email: details.email,
						password: details.password
					});
			});
	};

	service.signIn = function(credentials) {
		return $http({
			method: 'POST',
			url: API.customers + '/authenticate',
			data: credentials
		})
			.then(storeCustomerInfo)
			.then(function(response) {
				$rootScope.$emit('userSignIn', response);
				return response;
			})
			.catch(notifyError);
	};

	service.signOut = function() {
		customerInfo = null;
		sessionInfo = null;
		browserStorage.removeItem('customer_id');
		browserStorage.removeItem('token');
		$rootScope.$emit('userSignOut');
		return $q.when(customerInfo);
	};
}

angular
	.module('app')
	.service('customerService', CustomerService);
