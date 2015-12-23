function OrderController (orderDetails, supplierInfo) {
	var vm = this;

	vm.order = orderDetails;

	vm.supplierInfo = supplierInfo;
}

OrderController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, ordersService) {
		return ordersService
			.getOrder($stateParams.id);
	},
	supplierInfo: function($q, orderDetails, suppliersService) {
		return $q.all(orderDetails.basket.order_forms.map(function(order_form) {
			return suppliersService
				.getSupplierInfo(order_form.supplier_id);
		}))
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
};

angular
	.module('app')
	.controller('OrderController', OrderController);
