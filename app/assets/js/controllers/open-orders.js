function OpenOrdersController ($filter, $state, $q, $mdToast, ordersService, openOrders, supplierInfo, _) {
	var vm = this;
	var $date = $filter('date');
	var $materialDate = $filter('materialDate');

	function offerUndo (deliveries, undo) {
		return $mdToast.show(
			$mdToast.simple()
				.content(deliveries + ' ' + ((deliveries === 1) ? 'delivery' : 'deliveries') + ' marked as received')
				.action('undo')
				.hideDelay(4000)
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
		var materialDate = $materialDate(date);
		var dateGroupIndex;
		var dateIndex;
		var supplierIndex;

		if ($event) {
			$event.stopPropagation();
		}

		function undo () {
			return resetSupplierStatus(supplier)
				.then(function() {
					vm.orders[dateGroupIndex].days[dateIndex].suppliers.splice(supplierIndex, 0, supplier);
				});
		}

		markSupplierAsDelivered(supplier)
			.then(function() {
				dateGroupIndex = _.findIndex(vm.orders, {date: materialDate});
				dateIndex = _.findIndex(vm.orders[dateGroupIndex].days, {date: date});
				supplierIndex = _.findIndex(vm.orders[dateGroupIndex].days[dateIndex].suppliers, {supplier_id: supplier.supplier_id});
				vm.orders[dateGroupIndex].days[dateIndex].suppliers.splice(supplierIndex, 1);

				return offerUndo(deliveries, undo);
			});
	};

	vm.markAllAsDelivered = function(deliveryDay) {
		var deliveries = deliveryDay.suppliers.reduce(function(total, supplier) {
			return total += supplier.order_forms.length;
		}, 0);
		var materialDate = $materialDate(deliveryDay.date);
		var dateIndex;
		var dateGroupIndex;

		function undo () {
			return $q.all(deliveryDay.suppliers.map(resetSupplierStatus))
				.then(function() {
					vm.orders[dateGroupIndex].days.splice(dateIndex, 0, deliveryDay);
				});
		}

		$q.all(deliveryDay.suppliers.map(markSupplierAsDelivered))
			.then(function() {
				dateGroupIndex = _.findIndex(vm.orders, {date: materialDate});
				dateIndex = _.findIndex(vm.orders[dateGroupIndex].days, {date: deliveryDay.date});
				vm.orders[dateGroupIndex].days.splice(dateIndex, 1);

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
