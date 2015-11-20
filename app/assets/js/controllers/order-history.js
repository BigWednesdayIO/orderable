function OrderHistoryController (suppliersService, orderHistory) {
	var vm = this;

	vm.orders = orderHistory;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;
}

OrderHistoryController.resolve = /* @ngInject */ {
	orderHistory: function(ordersService) {
		return ordersService
			.getOrders();
	}
}

angular
	.module('app')
	.controller('OrderHistoryController', OrderHistoryController);
