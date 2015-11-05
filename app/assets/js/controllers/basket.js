function BasketController (basketService) {
	var vm = this;

	vm.basket = basketService.basket;
}

angular
	.module('app')
	.controller('BasketController', BasketController);
