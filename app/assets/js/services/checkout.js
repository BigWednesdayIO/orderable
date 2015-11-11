function CheckoutService ($http, $q) {
	var service = {},
		checkout;

	service.beginCheckout = function(basket) {
		// Post basket to API to kick things off
		checkout = {
			delivery_address: {
				name: 'Full Name',
				company: 'A Company',
				line_1: '234 High Street',
				line_2: null,
				line_3: null,
				city: 'London',
				region: 'London',
				postcode: 'SW1 1AB',
				country: 'GB'
			},
			billing_address: {
				name: 'Full Name',
				email: 'test_customer@bigwednesday.io',
				company: 'A Company',
				line_1: '234 High Street',
				line_2: null,
				line_3: null,
				city: 'London',
				region: 'London',
				postcode: 'SW1 1AB',
				country: 'GB'
			},
			payment: {
				card_number: '4242424242424242',
				card_type: 'VISA',
				csc: '123',
				expiry_month: 8,
				expiry_year: 2016
			},
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

	return service;
}

angular
	.module('app')
	.factory('checkoutService', CheckoutService);
