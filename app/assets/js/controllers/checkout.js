function CheckoutController ($rootScope, $state, checkoutService, addressService, checkoutData, customerInfo, supplierInfo, deliveryDates) {
	var vm = this;

	vm.checkout = checkoutData;

	vm.deliveryDates = deliveryDates;

	vm.supplierInfo = supplierInfo;

	vm.checkout.billing_address.email = customerInfo.email;

	vm.editAddress = function($event, addressName) {
		addressName += '_address';
		addressService
			.editAddress($event, vm.checkout[addressName])
			.then(function(newAddress) {
				vm.checkout[addressName] = newAddress;
			});
	};

	vm.editPayment = function($event) {
		checkoutService
			.editPayment($event, vm.checkout.payment)
			.then(function(newPayment) {
				vm.checkout.payment = newPayment;
			});
	};

	vm.completeCheckout = function() {
		checkoutService
			.completeCheckout(vm.checkout)
			.then(function(response) {
				$state.go('order-confirmation', {
					id: response.id
				});
			});
	}

	$rootScope.$on('deliveryUpdated', function() {
		vm.checkout.basket.shipping_total = vm.checkout.basket.order_forms.reduce(function(total, order_form) {
			return total + (((order_form.delivery_window || {}).price || 0) * 100);
		}, 0) / 100;
		vm.checkout.basket.total = vm.checkout.basket.subtotal + vm.checkout.basket.tax + vm.checkout.basket.shipping_total;
	});
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
	supplierInfo: function($q, checkoutData, suppliersService) {
		return $q.all(checkoutData.basket.order_forms.map(function(order_form) {
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
	deliveryDates: function($q, deliveryDatesService, checkoutData) {
		return $q.all(checkoutData.basket.order_forms.reduce(function(promises, order_form) {
			promises[order_form.supplier_id] = deliveryDatesService
				.getDatesForOrderForm(order_form);
			return promises;
		}, {}));
	},
	customerInfo: function(customerService) {
		return customerService
			.getInfo();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('CheckoutController', CheckoutController);
