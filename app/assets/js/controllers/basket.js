function BasketController ($rootScope, $state, $timeout, basketService, checkoutService, wishlistService, suppliersService, wishlist) {
	var vm = this,
		blurTimer;

	function getBasketSuppliers () {
		vm.basketSuppliers = vm.basket.order_forms.map(function(order_form) {
			return order_form.supplier_id;
		})
	}

	vm.basket = basketService.basket;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

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
		checkoutService
			.beginCheckout(vm.basket)
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
