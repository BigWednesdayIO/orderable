function PurchaseOrderController ($window, $timeout, $stateParams, orderDetails, supplierInfo, supplierMembership) {
	var vm = this;

	vm.order = orderDetails;

	vm.supplierInfo = supplierInfo;

	vm.membership = supplierMembership;

	vm.print = function() {
		$window.print();
	};

	if ($stateParams.print) {
		$timeout(vm.print, 500);
	}
}

PurchaseOrderController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, ordersService, _) {
		return ordersService
			.getOrder($stateParams.orderId)
			.then(function(order) {
				var orderForm = _.findWhere(order.basket.order_forms, {id: $stateParams.id});
				orderForm.order_id = order.id;
				orderForm.delivery_address = order.delivery_address;
				orderForm.billing_address = order.billing_address;
				return orderForm;
			});
	},
	supplierInfo: function(suppliersService, orderDetails) {
		return suppliersService
			.getSupplierInfo(orderDetails.supplier_id)
			.then(function(supplier) {
				var map = {};
				map[supplier.id] = supplier;
				return map;
			});
	},
	supplierMembership: function(membershipsService, orderDetails) {
		return membershipsService
			.getSupplierMembership(orderDetails.supplier_id)
			.catch(function() {
				return false;
			});
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('PurchaseOrderController', PurchaseOrderController);
