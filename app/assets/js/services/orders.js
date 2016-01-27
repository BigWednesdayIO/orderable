function OrdersService ($filter, $http, $q, API, customerService, _) {
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

	service.getOutstandingDeliveries = function() {
		return service
			.getOrders()
			.then(function(orders) {
				var orderForms = orders.map(function(order) {
					return order.basket.order_forms.map(function(orderForm) {
						orderForm.order_id = order.id;
						return orderForm;
					});
				});
				var $date = $filter('date');

				return _(orderForms)
					.flatten()
					.filter(function(orderForm) {
						return orderForm.status !== 'delivered';
					})
					.sortByOrder(['delivery_window.end'], ['asc'])
					.groupBy(function(orderForm) {
						var date = new Date(orderForm.delivery_date)
						return $date(date, 'yyyy-MM-dd');
					})
					.map(function(orderForms, date) {
						return {
							date: date,
							order_forms: orderForms
						};
					})
					.sortBy(['date'])
					.value();
			});
	};

	service.updateOrderFormStatus = function(orderId, orderFormId, status) {
		return $http({
			method: 'PATCH',
			url: API.orders + '/' + orderId + '/order_forms/' + orderFormId + '/status',
			data: {
				status: status
			},
			headers: {
				Authorization: customerService.getSessionInfo().token
			}
		});
	};

	service.updateWholeOrderStatus = function(order, status) {
		var updates = order.basket.order_forms.filter(function(order_form) {
			return order_form.status !== 'delivered';
		}).map(function(orderForm) {
			return service
				.updateOrderFormStatus(order.id, orderForm.id, 'delivered');
		});

		return $q.all(updates);
	};
}

angular
	.module('app')
	.service('ordersService', OrdersService);
