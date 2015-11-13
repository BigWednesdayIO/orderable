function BasketController ($rootScope, $state, $timeout, basketService, checkoutService, suppliersService) {
	var vm = this,
		blurTimer;

	vm.basket = basketService.basket;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.removeFromBasket = function(product) {
		basketService
			.removeFromBasket(product);
	};

	vm.updateQuantity = function(product, quantity) {
		$timeout(function() {
			$timeout.cancel(blurTimer);
			vm.quantityFocus[product.id] = false;
		}, 0);
		basketService
			.addToBasket(product, quantity);
	}

	vm.quantity = {};
	vm.quantityFocus = {};

	vm.handleBlur = function(line_item) {
		blurTimer = $timeout(function() {
			vm.quantity[line_item.product.id] = line_item.quantity;
			vm.quantityFocus[line_item.product.id] = false;
		}, 150);
	}

	vm.basketSuppliers = vm.basket.order_forms.map(function(order_form) {
		return order_form.supplier;
	});

	vm.beginCheckout = function() {
		checkoutService
			.beginCheckout(vm.basket)
			.then(function() {
				$state.go('checkout');
			});
	};
}

BasketController.resolve = /* @ngInject */ {
	serverBasket: function(basketService) {
		return basketService
			.getServerBasket();
	},
	redirectEmptyBasket: function($state, basketService) {
		if (!basket.basketService.line_items.length) {
			$state.go('home');
		}
	}
};

angular
	.module('app')
	.controller('BasketController', BasketController);
