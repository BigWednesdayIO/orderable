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
	};

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

	$rootScope.$on('basketUpdated', function() {
		basketService.basket.order_forms.forEach(function(order_form) {
			order_form.line_items.forEach(function(line_item) {
				vm.quantity[line_item.product.id] = line_item.quantity;
			});
		});
	});
}

BasketController.resolve = /* @ngInject */ {
	serverBasket: function(basketService) {
		return basketService
			.getServerBasket();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('BasketController', BasketController);
