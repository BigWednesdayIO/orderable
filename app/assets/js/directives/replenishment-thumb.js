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
		controller: function(replenishmentService) {
			var vm = this;
			var initialQuantity = vm.quantity;

			vm.product.id = vm.product.objectID;

			vm.product.thumbnail_image_url = vm.product.thumbnail_image_url || 'assets/images/placeholder.jpg';

			vm.include = true;

			vm.toggleInclude = function() {
				vm.quantity = (!vm.quantity) ? initialQuantity : 0;
			};

			vm.changeQuantity = function(quantity) {
				vm.quantity += quantity;
				if (vm.quantity < 0) {
					vm.quantity = 0;
				}
				vm.include = (vm.quantity !== 0)
			};

			vm.trapClick = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
			};

			vm.replenishItem = function() {
				replenishmentService
					.replenish([{
						product: vm.product,
						quantity: vm.quantity
					}]);
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
