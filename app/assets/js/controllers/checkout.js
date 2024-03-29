function CheckoutController ($rootScope, $state, checkoutService, addressService, checkoutData, customerInfo, supplierInfo, deliveryDates, suggestedAddress, paymentMethods) {
	var vm = this;

	vm.checkout = checkoutData;

	vm.deliveryDates = deliveryDates;

	vm.supplierInfo = supplierInfo;

	vm.addDeliveryNote = function($event, orderForm) {
		var supplierName = vm.supplierInfo[orderForm.supplier_id].name;
		checkoutService
			.editDeliveryNote($event, orderForm.delivery_note, supplierName)
			.then(function(deliveryNote) {
				orderForm.delivery_note = deliveryNote;
			});
	};

	if (suggestedAddress) {
		vm.checkout.delivery_address = angular.copy(suggestedAddress);
		vm.checkout.billing_address = angular.copy(suggestedAddress);
	}

	vm.checkout.billing_address.email = customerInfo.email;

	vm.editAddress = function($event, addressName) {
		addressName += '_address';
		addressService
			.editAddress($event, vm.checkout[addressName])
			.then(function(newAddress) {
				vm.checkout[addressName] = newAddress;
			});
	};

	vm.paymentMethods = paymentMethods;
	vm.checkout.payment_method = paymentMethods[0].value;

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
	};

	$rootScope.$on('deliveryUpdated', function() {
		checkoutService.calculateDeliveryTotals(vm.checkout.basket);
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
	suggestedAddress: function(addressService, ordersService, customerInfo) {
		return addressService
			.getDefaultAddress(customerInfo.addresses)
			.then(function(suggested) {
				return suggested || service
					.getLatestOrder()
					.then(function(latestOrder) {
						latestOrder.delivery_address;
					})
			})
			.catch(function() {
				return {};
			});
	},
	paymentMethods: function(checkoutService) {
		return checkoutService
			.getPaymentMethods();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('CheckoutController', CheckoutController);
