function OrderHistoryController ($state, orderHistory, supplierInfo) {
	var vm = this;

	vm.orders = orderHistory;

	vm.supplierInfo = supplierInfo;

	vm.viewPurchaseOrder = function(orderId, id) {
		$state.go('purchase-order', {
			orderId: orderId,
			id: id
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
	}
}

angular
	.module('app')
	.controller('OrderHistoryController', OrderHistoryController);
