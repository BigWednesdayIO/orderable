function ProductThumbDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '=',
			basket: '='
		},
		link: function(scope, element) {
			element.addClass('product-thumb');
		},
		controller: function(basketService) {
			var vm = this;

			vm.product.id = vm.product.objectID;

			vm.addToBasket = function($event) {
				$event.preventDefault();
				basketService
					.addToBasket();
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-thumb.html'
	}
}

angular
	.module('app')
	.directive('productThumb', ProductThumbDirective);
