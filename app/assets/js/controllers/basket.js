function BasketController ($rootScope, $state, $timeout, $q, basketService, checkoutService, wishlistService, suppliersService, membershipsService, wishlist, supplierNames) {
	var vm = this,
		blurTimer;

	function getBasketSuppliers () {
		$q.all(vm.basket.order_forms.map(function(order_form) {
			return suppliersService
				.getSupplierInfo(order_form.supplier_id);
		}))
			.then(function(basketSuppliers) {
				vm.basketSuppliers = basketSuppliers;
			})
	}

	vm.basket = basketService.basket;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.supplierNames = supplierNames;

	vm.removeFromBasket = function(product) {
		return basketService
			.removeFromBasket(product);
	};

	vm.updateQuantity = function(product, quantity) {
		$timeout(function() {
			$timeout.cancel(blurTimer);
			vm.quantityFocus[product.id] = false;
		}, 0);
		return basketService
			.addToBasket(product, quantity);
	}

	vm.quantity = {};
	vm.quantityFocus = {};

	vm.handleBlur = function(line_item) {
		blurTimer = $timeout(function() {
			vm.quantity[line_item.product.id] = line_item.quantity;
			vm.quantityFocus[line_item.product.id] = false;
		}, 150);
	};

	vm.beginCheckout = function() {
		var updateMemberships;

		if (vm.supplierMembershipsForm.$dirty) {
			updateMemberships = membershipsService
				.updateMemberships(vm.supplierMemberships.map(function(supplierMembership) {
					return {
						supplier_id: supplierMembership.supplier.id,
						membership_number: supplierMembership.number
					};
				}));
		}

		$q.when(updateMemberships)
			.then(function() {
				return checkoutService
					.beginCheckout(vm.basket)
			})
			.then(function() {
				$state.go('checkout');
			});
	};

	vm.savedForLater = wishlist;

	vm.saveForLater = function(product) {
		return wishlistService
			.saveForLater(product)
			.then(function(updatedWishlist) {
				vm.savedForLater = updatedWishlist;
				return basketService
					.removeFromBasket(product);
			});
	};

	vm.removeFromSaved = function(product) {
		return wishlistService
			.remove(product)
			.then(function(updatedWishlist) {
				vm.savedForLater = updatedWishlist;
			});
	};

	vm.addSavedToBasket = function(product) {
		return vm.updateQuantity(product, 1)
			.then(function() {
				return vm.removeFromSaved(product);
			})
	};

	getBasketSuppliers();

	$rootScope.$on('basketUpdated', function() {
		basketService.basket.order_forms.forEach(function(order_form) {
			order_form.line_items.forEach(function(line_item) {
				vm.quantity[line_item.product.id] = line_item.quantity;
			});
		});
		getBasketSuppliers();
	});
}

BasketController.resolve = /* @ngInject */ {
	serverBasket: function(basketService) {
		return basketService
			.getServerBasket();
	},
	supplierNames: function($q, suppliersService, serverBasket) {
		return $q.all(serverBasket.order_forms.map(function(order_form) {
			return suppliersService
				.getNameForSupplier(order_form.supplier_id);
		}))
			.then(function(names) {
				return names
					.map(function(name, i) {
						return {
							name: name,
							id: serverBasket.order_forms[i].supplier_id
						};
					})
					.reduce(function(map, supplier) {
						map[supplier.id] = supplier.name;
						return map;
					}, {});
			});
	},
	wishlist: function(wishlistService) {
		return wishlistService
			.getWishlist();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('BasketController', BasketController);
