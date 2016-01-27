function OrderHistoryController (orderHistory, supplierInfo) {
	var vm = this;

	vm.orders = orderHistory;

	vm.supplierInfo = supplierInfo;
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
