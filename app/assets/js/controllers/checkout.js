function CheckoutController ($timeout, checkoutService, addressService, suppliersService, checkoutData, deliveryDates) {
	var vm = this;

	vm.checkout = checkoutData;

	vm.deliveryDates = deliveryDates;

	vm.checkout.basket.order_forms = vm.checkout.basket.order_forms.map(function(order_form) {
		order_form.delivery_window = vm.deliveryDates[order_form.supplier][0].windows[0];
		return order_form;
	});

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.editAddress = function($event, addressName) {
		addressName += '_address';
		addressService
			.editAddress($event, vm.checkout[addressName])
			.then(function(newAddress) {
				vm.checkout[addressName] = newAddress;
			});
	};

	vm.changeWindow = function(order_form) {
		vm.showOptions = order_form.supplier;
		vm.showDay = order_form.delivery_window.date;
	};

	vm.selectWindow = function(order_form, deliveryWindow) {
		order_form.delivery_window = deliveryWindow;
		$timeout(function() {
			vm.showOptions = false;
		}, 200);
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
