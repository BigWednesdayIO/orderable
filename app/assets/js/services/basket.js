function BasketService ($rootScope, $q, browserStorage, _) {
	var service = {};

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

		return $q.when(service.basket.order_forms[supplierIndex].line_items[productIndex]);
	};

	service.removeFromBasket = function(product) {
		var supplierIndex = _.findIndex(service.basket.order_forms, {supplier: product.supplier}),
			productIndex;

		if (supplierIndex === -1) {
			return $q.reject({
				message: 'No matching supplier in basket'
			});
		}

		productIndex = _.findIndex(service.basket.order_forms[supplierIndex].line_items, {product: {id: product.id}});

		if (productIndex === -1) {
			return $q.reject({
				message: 'Product not in basket'
			});
		}

		service.basket.order_forms[supplierIndex].line_items.splice(productIndex, 1);

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

	return service;
}

angular
	.module('app')
	.factory('basketService', BasketService);
