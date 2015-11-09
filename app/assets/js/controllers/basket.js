function BasketController (basketService, suppliersService) {
	var vm = this;

	vm.basket = basketService.basket;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;
}

BasketController.resolve = /* @ngInject */ {
	serverBasket: function(basketService) {
		return basketService
			.getServerBasket();
	}
};

angular
	.module('app')
	.controller('BasketController', BasketController);
