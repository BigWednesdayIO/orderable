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
		controller: function($timeout, basketService) {
			var vm = this,
				debounce;

			function addToBasket (quantity) {
				basketService
					.addToBasket(vm.product, quantity)
					.then(function(line_item) {
						vm.quantity = line_item.quantity;
					});
			}

			vm.product.id = vm.product.objectID;

			vm.addToBasket = function($event, quantity) {
				$event.preventDefault();
				addToBasket(quantity);
			};

			vm.changeQuantity = function($event, quantity) {
				$event.preventDefault();
				vm.quantity += quantity;

				$timeout.cancel(debounce);
				debounce = $timeout(function() {
					addToBasket(vm.quantity);
				}, 300);
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
