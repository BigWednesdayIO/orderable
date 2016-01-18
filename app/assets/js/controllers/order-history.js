function OrderHistoryController (ordersService, orderHistory, supplierInfo, outstandingDeliveries) {
	var vm = this;

	vm.orders = orderHistory;

	vm.supplierInfo = supplierInfo;

	vm.outstandingDeliveries = outstandingDeliveries;

	vm.markAsDelivered = function(order, orderForm) {
		return ordersService
			.updateOrderFormStatus(order.id, orderForm.id, 'delivered')
			.then(function(updatedOrderForm) {
				orderForm.status = updatedOrderForm.status;
				delete vm.outstandingDeliveries[order.id][orderForm.id];
				if (Object.keys(vm.outstandingDeliveries[order.id]).length === 0) {
					delete vm.outstandingDeliveries[order.id];
				}
			});
	};

	vm.markAllAsDelivered = function(order) {
		ordersService
			.updateWholeOrderStatus(order, 'delivered')
			.then(function() {
				delete vm.outstandingDeliveries[order.id];
			});
	};
}

OrderHistoryController.resolve = /* @ngInject */ {
	orderHistory: function(ordersService) {
		return ordersService
			.getOrders();
	},
	supplierInfo: function(suppliersService) {
		return suppliersService
			.getAllSuppliers()
			.then(function(suppliers) {
				return suppliers.reduce(function(map, supplier) {
					map[supplier.id] = supplier;
					return map;
				}, {});
			});
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	},
	outstandingDeliveries: function($q, ordersService, _, orderHistory) {
		return $q.all(orderHistory.map(function(order) {
			return ordersService
				.getOutstandingDeliveries(order.basket.order_forms)
		}))
			.then(function(orders) {
				return orders.reduce(function(unfulfilledOrderMapping, outstandingDeliveries, index) {
					if (!outstandingDeliveries.length) {
						return unfulfilledOrderMapping;
					}

					unfulfilledOrderMapping[orderHistory[index].id] = outstandingDeliveries.reduce(function(deliveries, orderForm) {
						deliveries[orderForm.id] = orderForm;
						return deliveries;
					}, {});

					return unfulfilledOrderMapping;
				}, {});
			});
	}
}

angular
	.module('app')
	.controller('OrderHistoryController', OrderHistoryController);
