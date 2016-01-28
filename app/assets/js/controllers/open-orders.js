function OpenOrdersController ($filter, $state, $q, $mdToast, ordersService, openOrders, supplierInfo, _) {
	var vm = this;
	var $date = $filter('date');

	function offerUndo (deliveries, undo) {
		return $mdToast.show(
			$mdToast.simple()
				.content(deliveries + ' ' + ((deliveries === 1) ? 'delivery' : 'deliveries') + ' marked as received')
				.action('undo')
				.hideDelay(3000)
		)
			.then(function(response) {
				if (response === 'ok') {
					return undo();
				}
			});
	}

	function markAsDelivered (orderForm) {
		return ordersService
			.updateOrderFormStatus(orderForm.order_id, orderForm.id, 'delivered');
	}

	function markSupplierAsDelivered (supplier) {
		return $q.all(supplier.order_forms.map(function(orderForm) {
			return markAsDelivered(orderForm);
		}))
	}

	function resetSupplierStatus (supplier) {
		return $q.all(supplier.order_forms.map(function(orderForm) {
			return ordersService
				.updateOrderFormStatus(orderForm.order_id, orderForm.id, orderForm.status);
		}));
	}

	vm.orders = openOrders;

	vm.supplierInfo = supplierInfo;

	vm.viewOrder = function(orderForm) {
		$state.go('order', {
			id: orderForm.order_id
		});
	};

	vm.markSupplierAsDelivered = function($event, supplier) {
		var deliveries = supplier.order_forms.length;
		var date = $date(supplier.order_forms[0].delivery_date, 'yyyy-MM-dd');
		var dateIndex;
		var supplierIndex;

		$event.stopPropagation();

		function undo () {
			return resetSupplierStatus(supplier)
				.then(function() {
					if (typeof supplierIndex !== 'undefined') {
						vm.orders[dateIndex].suppliers.splice(supplierIndex, 0, supplier);
						return;
					}

					vm.orders.splice(dateIndex, 0, {
						date: date,
						suppliers: [supplier]
					});
				});
		}

		markSupplierAsDelivered(supplier)
			.then(function() {
				dateIndex = _.findIndex(vm.orders, {date: date});

				if (vm.orders[dateIndex].suppliers.length === 1) {
					vm.orders.splice(dateIndex, 1);
				} else {
					supplierIndex = _.findIndex(vm.orders[dateIndex].suppliers, {supplier_id: supplier.supplier_id});
					vm.orders[dateIndex].suppliers.splice(supplierIndex, 1);
				}

				return offerUndo(deliveries, undo);
			});
	};

	vm.markAllAsDelivered = function(deliveryDay) {
		var deliveries = deliveryDay.suppliers.reduce(function(total, supplier) {
			return total += supplier.order_forms.length;
		}, 0);
		var dateIndex;

		function undo () {
			return $q.all(deliveryDay.suppliers.map(resetSupplierStatus))
				.then(function() {
					vm.orders.splice(dateIndex, 0, deliveryDay);
				});
		}

		$q.all(deliveryDay.suppliers.map(markSupplierAsDelivered))
			.then(function() {
				dateIndex = _.findIndex(vm.orders, {date: deliveryDay.date});
				vm.orders.splice(dateIndex, 1);

				return offerUndo(deliveries, undo);
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
