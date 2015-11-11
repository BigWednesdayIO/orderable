function CheckoutController ($scope, $document, $timeout, checkoutService, addressService, suppliersService, checkoutData, deliveryDates) {
	var vm = this;

	vm.checkout = checkoutData;

	vm.deliveryDates = deliveryDates;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.editAddress = function($event, addressName) {
		addressName += '_address';
		addressService
			.editAddress($event, vm.checkout[addressName])
			.then(function(newAddress) {
				vm.checkout[addressName] = newAddress;
			});
	};
}

CheckoutController.resolve = /* @ngInject */ {
	checkoutData: function(checkoutService, basketService) {
		return checkoutService
			.getCheckout()
			.catch(function() {
				return checkoutService
					.beginCheckout(basketService.basket);
			});
	},
	deliveryDates: function($q, deliveryDatesService, checkoutData) {
		return $q.all(checkoutData.basket.order_forms.reduce(function(promises, order_form) {
			promises[order_form.supplier] = deliveryDatesService
				.getDatesForOrderForm(order_form);
			return promises;
		}, {}));
	}
};

angular
	.module('app')
	.controller('CheckoutController', CheckoutController);
