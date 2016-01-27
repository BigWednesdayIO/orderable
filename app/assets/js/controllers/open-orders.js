function OpenOrdersController ($filter, $state, $q, ordersService, openOrders, supplierInfo, _) {
	var vm = this;
	var $date = $filter('date');

	function markAsDelivered (orderForm) {
		return ordersService
			.updateOrderFormStatus(orderForm.order_id, orderForm.id, 'delivered')
	}

	vm.orders = openOrders;

	vm.supplierInfo = supplierInfo;

	vm.viewOrder = function(orderForm) {
		$state.go('order', {
			id: orderForm.order_id
		});
	};

	vm.markAsDelivered = function(orderForm) {
		markAsDelivered(orderForm)
			.then(function(updatedOrderForm) {
				var date = $date(orderForm.delivery_date, 'yyyy-MM-dd');
				var dateIndex = _.findIndex(vm.orders, {date: date});
				var orderFormIndex;

				if (vm.orders[dateIndex].order_forms.length === 1) {
					vm.orders.splice(dateIndex, 1);
					return;
				}

				orderFormIndex = _.findIndex(vm.orders[dateIndex].order_forms, {id: orderForm.id});
				vm.orders[dateIndex].order_forms.splice(orderFormIndex, 1);
			});
	};

	vm.markAllAsDelivered = function(deliveryDay) {
		$q.all(deliveryDay.order_forms.map(function(orderForm) {
			return markAsDelivered(orderForm);
		}))
			.then(function() {
				var dateIndex = _.findIndex(vm.orders, {date: deliveryDay.date});
				vm.orders.splice(dateIndex, 1);
			});
	};

	/*
	// Reset it all
	ordersService
		.getOrders()
		.then(function(orders) {
			orders.forEach(function(order) {
				order.basket.order_forms.filter(function(orderForm) {
					return orderForm.status === 'delivered';
				}).forEach(function(orderForm) {
					ordersService
						.updateOrderFormStatus(order.id, orderForm.id, 'accepted');
				});
			});
		});
	*/
}

OpenOrdersController.resolve = /* @ngInject */ {
	openOrders: function(ordersService) {
		return ordersService
			.getOutstandingDeliveries();
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
	}
}

angular
	.module('app')
	.controller('OpenOrdersController', OpenOrdersController);
