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

			vm.addToBasket = function($event, quantity) {
				$event.preventDefault();
				basketService
					.addToBasket(vm.product, quantity)
					.then(function(line_item) {
						vm.quantity = line_item.quantity;
					});
			};

			vm.changeQuantity = function($event, quantity) {
				vm.quantity += quantity;
				vm.addToBasket($event, vm.quantity);
			};

			basketService
				.getProductQuantity(vm.product)
				.then(function(quantity) {
					vm.quantity = quantity;
				});
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-thumb.html'
	}
}

angular
	.module('app')
	.directive('productThumb', ProductThumbDirective);
