function ReplenishmentService ($state, $q, $timeout, ordersService, customerService, productsService, basketService, deliveryDatesService, checkoutService, addressService, _) {
	var service = this;

	service.refreshLineItems = function(lineItems) {
		return productsService
			.getProductArray(_.map(lineItems, 'product.id'))
			.then(function(upToDateProducts) {
				return _(lineItems)
					.map(function(lineItem) {
						lineItem.product = _.find(upToDateProducts, {objectID: lineItem.product.id});
						return lineItem;
					})
					.filter(function(lineItem) {
						return typeof lineItem.product !== 'undefined';
					})
					.value();
			});
	}

	service.getReplenishmentItems = function() {
		return ordersService
			.getOrders()
			.then(function(orders) {
				var today = (new Date()).getDate();
				var twoWeeksAgo = (new Date()).setDate(today - 14);
				var lineItems = _(orders)
					.filter(function(order) {
						var then = new Date(order._metadata.created);
						return then > twoWeeksAgo;
					})
					.map('basket.order_forms')
					.flatten()
					.map('line_items')
					.flatten()
					.groupBy('product.id')
					.filter(function(purchases) {
						return purchases.length > 1;
					})
					.sortByOrder(['length'], ['desc'])
					.map(_.head)
					.value();

				return service
					.refreshLineItems(lineItems);
			});
	};

	service.replenish = function(items) {
		var oldBasket = angular.copy(basketService.basket);
		basketService.hideUpdates = true;
		return basketService
			.createBasket()
			.then(function() {
				var additions = items
					.filter(function(item) {
						return item.quantity > 0;
					})
					.map(function(item) {
						return basketService
							.addToBasket(item.product, item.quantity)
							.catch(function() {
								return false;
							});
					});

				return $q.all(additions);
			})
			.then(function() {
				return $q.all([
					checkoutService
						.beginCheckout(basketService.basket),
					customerService
						.getInfo(),
					ordersService
						.getOrders(),
					$q.all(basketService.basket.order_forms.reduce(function(promises, order_form) {
						promises[order_form.supplier_id] = deliveryDatesService
							.getDatesForOrderForm(order_form);
						return promises;
					}, {}))
				]);
			})
			.then(function(responses) {
				var checkout = responses[0];
				var customerInfo = responses[1]
				var lastOrder = _.head(responses[2]);
				var deliveryDates = responses[3];

				return addressService
					.getDefaultAddress(customerInfo.addresses)
					.then(function(customerAddress) {
						checkout.delivery_address = customerAddress || lastOrder.delivery_address;
						checkout.billing_address = customerAddress || lastOrder.billing_address;
						checkout.billing_address.email = customerInfo.email;
						checkout.payment_method = lastOrder.payment_method;
						checkout.basket.order_forms = checkout.basket.order_forms.map(function(orderForm) {
							orderForm.delivery_window = deliveryDates[orderForm.supplier_id][0].windows[0];
							orderForm.delivery_date = orderForm.delivery_window.date;
							return orderForm;
						});
						checkoutService.calculateDeliveryTotals(checkout.basket);

						return checkoutService
							.completeCheckout(checkout);
					});
			})
			.then(function(response) {
				basketService.hideUpdates = false
				return $q.all([
					basketService
						.createBasket(oldBasket),
					$state
						.go('order-confirmation', {
							id: response.id
						})
				]);
			});
	};

	var replenishmentItems = [];
	var debounce;

	service.replenishSingleItem = function(item) {
		// Bundles up single replenishment calls into one request when placed close together
		var deferred = $q.defer();

		replenishmentItems.push(item);

		$timeout.cancel(debounce);
		debounce = $timeout(function() {
			var action = service
				.replenish(replenishmentItems);

			replenishmentItems = [];

			deferred.resolve(action);
		}, 1000);

		return deferred.promise;
	};
}

angular
	.module('app')
	.service('replenishmentService', ReplenishmentService);
