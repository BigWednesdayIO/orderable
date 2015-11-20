function OrdersService ($q, browserStorage, _) {
	var service = this;

	service.getOrders = function() {
		return $q.when(browserStorage.getItem('orders') || []);
	}

	service.getOrderById = function(id) {
		return service
			.getOrders()
			.then(function(orders) {
				return _.find(orders, {id: id});
			})
	}

	service.createOrder = function(order) {
		return service
			.getOrders()
			.then(function(orders) {
				orders.unshift(order);
				browserStorage.setItem('orders', orders);
				return orders;
			});
	};
}

angular
	.module('app')
	.service('ordersService', OrdersService);
