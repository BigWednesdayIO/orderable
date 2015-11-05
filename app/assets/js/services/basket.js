function BasketService ($timeout) {
	var service = {};

	service.basket = {
		id: 'foo',
		suppliers: [],
		subtotal: 0,
		tax: 0,
		total: 0,
		line_item_count: 5
	};

	service.addToBasket = function() {
		service.basket.line_item_count += 1;
	};

	return service;
}

angular
	.module('app')
	.factory('basketService', BasketService);
