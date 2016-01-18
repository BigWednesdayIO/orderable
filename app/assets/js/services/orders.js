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

	service.getOutstandingDeliveries = function(orderForms) {
		var outstanding = orderForms.filter(function(order_form) {
			return order_form.status !== 'delivered';
		});

		return $q.when(outstanding);
	}

	service.updateOrderFormStatus = function(orderId, orderFormId, status) {
		return $http({
			method: 'PATCH',
			url: API.orders + '/' + orderId + '/order_forms/' + orderFormId + '/status',
			data: {
				status: status
			}
		});
	};

	service.updateWholeOrderStatus = function(order, status) {
		return service
			.getOutstandingDeliveries(order.basket.order_forms)
			.then(function(outstanding) {
				var updates  = outstanding.map(function(orderForm) {
					return service
						.updateOrderFormStatus(order.id, orderForm.id, 'delivered');
				});

				return $q.all(updates);
			});
	};
}

angular
	.module('app')
	.service('ordersService', OrdersService);
