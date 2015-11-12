function OrderConfirmationController (suppliersService, orderDetails) {
	var vm = this;

	vm.order = orderDetails;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;
}

OrderConfirmationController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, checkoutService) {
		return checkoutService
			.getCheckout($stateParams.id);
	}	
};

angular
	.module('app')
	.controller('OrderConfirmationController', OrderConfirmationController);
