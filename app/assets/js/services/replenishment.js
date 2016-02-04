function ReplenishmentService ($state, $q, ordersService, productsService, basketService, deliveryDatesService, checkoutService, _) {
	var service = this;

	service.getReplenishmentItems = function() {
		return ordersService
			.getOrders()
			.then(function(orders) {
				var today = (new Date()).getDate();
				var twoWeeksAgo = (new Date()).setDate(today - 140);
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
					.sortBy('length')
					.map(_.head)
					.map(function(lineItem) {
						return productsService
							.getProductById(lineItem.product.id)
							.then(function(product) {
								lineItem.product = product;
								// TODO update price
								return lineItem;
							})
							.catch(function() {
								return false;
							});
					})
					.value();

				return $q.all(lineItems);
			})
			.then(function(updatedLineItems) {
				return updatedLineItems.filter(_.identity);
			});
	};

	service.replenish = function(items) {
		var oldBasket = angular.copy(basketService.basket);
		return basketService
			.createBasket()
			.then(function() {
				return $q.all(items.map(function(item) {
					return basketService
						.addToBasket(item.product, item.quantity)
						.catch(function() {
							return false;
						});
				}));				
			})
			.then(function() {
				return $q.all([
					checkoutService
						.beginCheckout(basketService.basket),
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
				var lastOrder = _.head(responses[1]);
				var deliveryDates = responses[2];

				checkout.delivery_address = lastOrder.delivery_address;
				checkout.billing_address = lastOrder.billing_address;
				checkout.payment_method = lastOrder.payment_method;
				checkout.basket.order_forms = checkout.basket.order_forms.map(function(orderForm) {
					orderForm.delivery_window = deliveryDates[orderForm.supplier_id][0].windows[0];
					return orderForm;
				});
				checkout.basket.shipping_total = checkout.basket.order_forms.reduce(function(total, order_form) {
					return total + (((order_form.delivery_window || {}).price || 0) * 100);
				}, 0) / 100;
				checkout.basket.total = checkout.basket.subtotal + checkout.basket.tax + checkout.basket.shipping_total;

				return checkoutService
					.completeCheckout(checkout);
			})
			.then(function(response) {
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
}

angular
	.module('app')
	.service('replenishmentService', ReplenishmentService);
