function ReplenishmentThumbDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '=',
			quantity: '=',
			supplier: '='
		},
		link: function(scope, element) {
			element.addClass('product-thumb product-thumb--replenishment');
		},
		controller: function() {
			var vm = this;

			vm.product.id = vm.product.objectID;

			vm.product.thumbnail_image_url = vm.product.thumbnail_image_url || 'assets/images/placeholder.jpg';

			vm.changeQuantity = function($event, quantity) {
				$event.preventDefault();
				vm.quantity += quantity;
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/replenishment-thumb.html'
	}
}

angular
	.module('app')
	.directive('replenishmentThumb', ReplenishmentThumbDirective);
