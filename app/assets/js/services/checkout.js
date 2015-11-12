function CheckoutService ($http, $q, $mdDialog) {
	var service = {},
		checkout;

	service.beginCheckout = function(basket) {
		// Post basket to API to kick things off
		checkout = {
			delivery_address: {},
			billing_address: {},
			payment: {},
			basket: basket
		};

		checkout.basket.order_forms = checkout.basket.order_forms.map(function(order_form) {
			order_form.sign_for = false;
			order_form.delivery_method = 'Standard';
			order_form.delivery_date = new Date();
			return order_form;
		});

		return $q.when(checkout);
	};

	service.getCheckout = function() {
		var deferred = $q.defer();

		if (checkout) {
			deferred.resolve(checkout);
		} else {
			deferred.reject({
				message: 'Checkout session not found'
			});
		}

		return deferred.promise;
	};

	service.editPayment = function($event, paymentInfo) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/payment-form.html',
				controller: 'PaymentController',
				controllerAs: 'vm',
				locals: {
					paymentInfo: angular.copy(paymentInfo)
				},
				clickOutsideToClose: true
			});
	};

	return service;
}

angular
	.module('app')
	.factory('checkoutService', CheckoutService);
