function OrderController (suppliersService, orderDetails) {
	var vm = this;

	vm.order = orderDetails;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;
}

OrderController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, checkoutService) {
		return checkoutService
			.getCheckout($stateParams.id);
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('OrderController', OrderController);
