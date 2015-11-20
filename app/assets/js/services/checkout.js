function CheckoutService ($http, $q, $mdDialog, basketService, ordersService, API) {
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

	service.getCheckout = function(id) {
		var deferred = $q.defer();

		if (id) {
			return $http({
				method: 'GET',
				url: API.checkouts + '/' + id
			});
		}

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

	service.completeCheckout = function(data) {
		if (!data.delivery_address.name || !data.billing_address.name || !data.payment.card_number) {
			return $q.reject({
				message: 'Please fill out all parts of the checkout form'
			});
		}

		data.payment.expiry_year += 2000;

		return $http({
			method: 'POST',
			url: API.checkouts,
			data: data
		})
			.then(function(checkoutResponse) {
				return $q.all([
					basketService
						.createBasket(),
					ordersService
						.createOrder(checkoutResponse)
				])
					.then(function() {
						return checkoutResponse;
					});
			});
	}

	return service;
}

angular
	.module('app')
	.factory('checkoutService', CheckoutService);
