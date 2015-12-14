function BasketService ($rootScope, $q, $document, $mdMedia, $mdToast, $state, browserStorage, authorizationService, _) {
	var service = {};

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}

	function emptyBakset () {
		return {
			id: 'WEB123456',
			currency: 'GBP',
			subtotal: 0,
			tax: 0,
			total: 0,
			line_item_count: 0,
			order_forms: []
		}
	};

	function toPence (value) {
		return value * 100;
	}

	function toPounds (value) {
		return value / 100;
	}

	function countProperty (collection, property) {
		return collection.reduce(function(total, each) {
			return total + each[property];
		}, 0);
	}

	function getSubtotal (collection) {
		return toPounds(collection.reduce(function(total, each) {
			return total + toPence(each.subtotal);
		}, 0));
	}

	function calculateTotals () {
		service.basket.order_forms + service.basket.order_forms.map(function(order_form) {
			order_form.line_items = order_form.line_items.map(function(line_item) {
				line_item.subtotal = toPounds(toPence(line_item.product.price) * line_item.quantity);
				return line_item;
			});

			order_form.line_item_count = countProperty(order_form.line_items, 'quantity');

			order_form.subtotal = getSubtotal(order_form.line_items);

			return order_form;
		});

		service.basket.line_item_count = countProperty(service.basket.order_forms, 'line_item_count');

		service.basket.subtotal = getSubtotal(service.basket.order_forms);

		service.basket.tax = toPounds(Math.round(toPence(service.basket.subtotal) * 0.2));

		service.basket.total = toPounds(toPence(service.basket.subtotal) + toPence(service.basket.tax));

		browserStorage.setItem('basket', service.basket);
		$rootScope.$emit('basketUpdated', service.basket.line_item_count);
	}

	function showUpdate (lineItem) {
		if (!$mdMedia('gt-md') || $state.is('basket') || $state.is('checkout')) {
			return;
		}
		return $mdToast.show({
			locals: {
				product: lineItem.product,
				quantity: lineItem.quantity
			},
			controller: 'BasketToastController',
			controllerAs: 'vm',
			bindToController: true,
			templateUrl: 'views/partials/basket-toast.html',
			parent : $document[0].querySelector('#basket-toast-area'),
			hideDelay: 9000,
			position: 'top right'
		});
	}

	service.basket = browserStorage.getItem('basket') || emptyBakset();

	calculateTotals();

	service.createBasket = function() {
		_.forEach(emptyBakset(), function(value, key) {
			service.basket[key] = value;
		});
		calculateTotals();
		return $q.when(service.basket);
	}

	service.addToBasket = function(product, quantity) {
		return authorizationService
			.requireSignIn()
			.then(function() {
				var supplierIndex = _.findIndex(service.basket.order_forms, {supplier: product.supplier}),
					productIndex;

				if (supplierIndex === -1) {
					service.basket.order_forms.push({
						supplier: product.supplier,
						line_items: []
					});
					supplierIndex = service.basket.order_forms.length - 1;
				}

				productIndex = _.findIndex(service.basket.order_forms[supplierIndex].line_items, {product: {id: product.id}});

				if (productIndex === -1) {
					service.basket.order_forms[supplierIndex].line_items.push({
						product: product,
						quantity: quantity
					});
					productIndex = service.basket.order_forms[supplierIndex].line_items.length - 1;
				} else {
					service.basket.order_forms[supplierIndex].line_items[productIndex].quantity = quantity;
				}

				calculateTotals();

				return service.basket.order_forms[supplierIndex].line_items[productIndex];
			})
			.then(function(lineItem) {
				showUpdate(lineItem);
				return lineItem;
			});
	};

	service.removeFromBasket = function(product) {
		var supplierIndex = _.findIndex(service.basket.order_forms, {supplier: product.supplier}),
			productIndex;

		if (supplierIndex === -1) {
			return notifyError({
				message: 'No matching supplier in basket'
			});
		}

		productIndex = _.findIndex(service.basket.order_forms[supplierIndex].line_items, {product: {id: product.id}});

		if (productIndex === -1) {
			return notifyError({
				message: 'Product not in basket'
			});
		}

		service.basket.order_forms[supplierIndex].line_items.splice(productIndex, 1);

		if (service.basket.order_forms[supplierIndex].line_items.length === 0) {
			service.basket.order_forms.splice(supplierIndex, 1);
		}

		calculateTotals();

		return $q.when();
	};

	service.getProductQuantity = function(product) {
		var supplierIndex = _.findIndex(service.basket.order_forms, {supplier: product.supplier}),
			productIndex;

		if (supplierIndex === -1) {
			return $q.when(0);
		}

		productIndex = _.findIndex(service.basket.order_forms[supplierIndex].line_items, {product: {id: product.id}});

		if (productIndex === -1) {
			return $q.when(0);
		}

		return $q.when(service.basket.order_forms[supplierIndex].line_items[productIndex].quantity);
	};

	service.getServerBasket = function() {
		return $q.when(service.basket);
	};

	browserStorage.watch('basket', function(e, newBasket) {
		Object.keys(newBasket).forEach(function(key) {
			service.basket[key] = newBasket[key];
		});
		$rootScope.$emit('basketUpdated', service.basket.line_item_count);
	});

	$rootScope.$on('userSignOut', function(e, info) {
		service.createBasket();
	});

	return service;
}

angular
	.module('app')
	.factory('basketService', BasketService);
