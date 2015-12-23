function OrdersService ($http, $q, API, customerService) {
	var service = this;

	service.getOrders = function() {
		var session = customerService.getSessionInfo();

		return $http({
			method: 'GET',
			url: API.orders,
			params: {
				customer_id: session.id
			},
			headers: {
				Authorization: session.token
			}
		});
	};

	service.getOrder = function(id) {
		return $http({
			method: 'GET',
			url: API.orders + '/' + id,
			headers: {
				Authorization: customerService.getSessionInfo().token
			}
		});
	};
}

angular
	.module('app')
	.service('ordersService', OrdersService);
