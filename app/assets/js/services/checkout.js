function CheckoutService ($http, $q, $mdDialog, $mdToast, basketService, customerService, API) {
	var service = {},
		checkout;

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}

	service.beginCheckout = function(basket) {
		// Post basket to API to kick things off
		checkout = {
			delivery_address: {},
			billing_address: {},
			basket: basket,
			customer_id: customerService.getSessionInfo().id
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
				url: API.checkouts + '/' + id,
				headers: {
					Authorization: customerService.getSessionInfo().token
				}
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

	service.calculateDeliveryTotals = function(basket) {
		basket.shipping_total = basket.order_forms.reduce(function(total, order_form) {
			return total + (((order_form.delivery_window || {}).price || 0) * 100);
		}, 0) / 100;
		basket.total = basket.subtotal + basket.tax + basket.shipping_total;
		basket.order_forms = basket.order_forms.map(function(orderForm) {
			if (orderForm.delivery_window) {
				orderForm.delivery_date = orderForm.delivery_window.date;
			}
			return orderForm;
		});
	};

	service.completeCheckout = function(data) {
		if (!data.delivery_address.name || !data.billing_address.name) {
			return notifyError({
				message: 'Please fill out all parts of the checkout form'
			});
		}

		return $http({
			method: 'POST',
			url: API.checkouts,
			data: data,
			headers: {
				Authorization: customerService.getSessionInfo().token
			}
		})
			.then(function(checkoutResponse) {
				return basketService
					.createBasket()
					.then(function() {
						return checkoutResponse;
					});
			})
			.catch(notifyError);
	};

	service.getPaymentMethods = function() {
		var methods = [
			{
				display_name: 'Add to account balance',
				value: 'account'
			}, {
				display_name: 'Cash on delivery',
				value: 'cash'
			}
		];

		return $q.when(methods);
	};

	return service;
}

angular
	.module('app')
	.factory('checkoutService', CheckoutService);
