function OrdersService ($http, $q, API, customerService, _) {
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
		})
			.then(function(orders) {
				return _.sortByOrder(orders, ['_metadata.created'], ['desc']);
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
