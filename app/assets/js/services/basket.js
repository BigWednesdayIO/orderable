function BasketService ($rootScope, $q, $document, $mdMedia, $mdToast, $state, browserStorage, suppliersService, membershipsService, authorizationService, _) {
	var service = {};
	var taxAmount = 0.2;

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
		return Math.round(value / 100);
	}

	function countProperty (collection, property) {
		return collection.reduce(function(total, each) {
			return total + each[property];
		}, 0);
	}

	function getTotal (collection, attribute) {
		return toPounds(collection.reduce(function(total, each) {
			return total + toPence(each[attribute]);
		}, 0));
	}

	function calculateTotals () {
		service.basket.order_forms + service.basket.order_forms.map(function(order_form) {
			order_form.line_items = order_form.line_items.map(function(line_item) {
				line_item.subtotal = toPounds(toPence(line_item.product.price) * line_item.quantity);
				return line_item;
			});

			order_form.line_item_count = countProperty(order_form.line_items, 'quantity');

			order_form.subtotal = getTotal(order_form.line_items, 'subtotal');

			order_form.taxable_subtotal = getTotal(order_form.line_items.filter(function(line_item) {
				return line_item.product.taxable;
			}), 'subtotal');

			order_form.tax = toPounds(toPence(order_form.taxable_subtotal) * taxAmount);

			order_form.total = toPounds(toPence(order_form.subtotal) + toPence(order_form.tax));

			return order_form;
		});

		service.basket.line_item_count = countProperty(service.basket.order_forms, 'line_item_count');

		service.basket.subtotal = getTotal(service.basket.order_forms, 'subtotal');

		service.basket.taxable_subtotal = getTotal(service.basket.order_forms, 'taxable_subtotal');

		service.basket.tax = toPounds(toPence(service.basket.taxable_subtotal) * taxAmount);

		service.basket.total = toPounds(toPence(service.basket.subtotal) + toPence(service.basket.tax));

		browserStorage.setItem('basket', service.basket);
		$rootScope.$emit('basketUpdated', service.basket.line_item_count);

		return $q.when(service.basket);
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

	function checkStock (product) {
		var deferred = $q.defer();

		if (product.in_stock !== false) {
			deferred.resolve();
		} else {
			deferred.reject({
				message: 'Sorry, this product is out of stock'
			});
		}

		return deferred.promise;
	}

	service.basket = browserStorage.getItem('basket') || emptyBakset();

	calculateTotals();

	service.createBasket = function(basket) {
		_.forEach(basket || emptyBakset(), function(value, key) {
			service.basket[key] = value;
		});
		return calculateTotals();
	};

	service.checkProductSupplier = function(product) {
		var currentSuppliers = suppliersService.getCurrentSuppliers();
		var match = _.find(currentSuppliers, {id: product.supplier_id});

		if (!match) {
			return $q.reject({
				message: 'Unfortunately this supplier does not deliver to your area'
			});
		}

		return suppliersService
			// Get latest info from server
			.getSupplierInfo(match.id)
			.then(function(supplier) {
				if (!supplier.has_memberships || supplier.purchase_restrictions === 'none') {
					return true;
				}

				return membershipsService
					.getSupplierMembership(supplier.id)
					.then(function(membership) {
						if (supplier.purchase_restrictions === 'verified' && !membership.price_adjustment_group_id) {
							return $q.reject({
								message: 'Supplier needs to verify membership first'
							});
						}

						return true;
					}, function() {
						return $q.reject({
							message: 'You need to have a membership with this supplier to purchase from them'
						});
					});;
			});
	};

	service.addToBasket = function(product, quantity) {
		return authorizationService
			.requireSignIn()
			.then(function() {
				return checkStock(product);
			})
			.then(function() {
				return service
					.checkProductSupplier(product);
			})
			.then(function() {
				var supplierIndex = _.findIndex(service.basket.order_forms, {supplier_id: product.supplier_id}),
					productIndex;

				if (supplierIndex === -1) {
					service.basket.order_forms.push({
						supplier_id: product.supplier_id,
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

				return calculateTotals()
					.then(function() {
						return service.basket.order_forms[supplierIndex].line_items[productIndex];
					});
			})
			.then(function(lineItem) {
				showUpdate(lineItem);
				return lineItem;
			})
			.catch(function notifyError (error) {
				$mdToast.show(
					$mdToast.simple()
						.content(error.message)
						.hideDelay(3000)
				);
				return $q.reject(error);
			});
	};

	service.removeFromBasket = function(product) {
		var supplierIndex = _.findIndex(service.basket.order_forms, {supplier_id: product.supplier_id}),
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

		return calculateTotals();
	};

	service.getProductQuantity = function(product) {
		var supplierIndex = _.findIndex(service.basket.order_forms, {supplier_id: product.supplier_id}),
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
