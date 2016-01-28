function OpenOrdersController ($filter, $state, $q, $mdToast, ordersService, openOrders, supplierInfo, _) {
	var vm = this;
	var $date = $filter('date');

	function markAsDelivered (orderForm) {
		return ordersService
			.updateOrderFormStatus(orderForm.order_id, orderForm.id, 'delivered');
	}

	vm.orders = openOrders;

	vm.supplierInfo = supplierInfo;

	vm.viewOrder = function(orderForm) {
		$state.go('order', {
			id: orderForm.order_id
		});
	};

	vm.markAsDelivered = function(orderForm) {
		var date = $date(orderForm.delivery_date, 'yyyy-MM-dd');
		var dateIndex;
		var orderFormIndex;

		function undo () {
			return ordersService
				.updateOrderFormStatus(orderForm.order_id, orderForm.id, orderForm.status)
				.then(function() {
					if (orderFormIndex) {
						vm.orders[dateIndex].order_forms.splice(orderFormIndex, 0, orderForm);
						return;
					}

					vm.orders.splice(dateIndex, 0, {
						date: date,
						order_forms: [
							orderForm
						]
					});
				});
		};

		markAsDelivered(orderForm)
			.then(function(updatedOrderForm) {
				dateIndex = _.findIndex(vm.orders, {date: date});

				if (vm.orders[dateIndex].order_forms.length === 1) {
					vm.orders.splice(dateIndex, 1);
				} else {
					orderFormIndex = _.findIndex(vm.orders[dateIndex].order_forms, {id: orderForm.id});
					vm.orders[dateIndex].order_forms.splice(orderFormIndex, 1);
				}

				return $mdToast.show(
					$mdToast.simple()
						.content('1 order marked as received')
						.action('undo')
						.hideDelay(3000)
				);
			})
			.then(function(response) {
				if (response === 'ok') {
					return undo();
				}
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
