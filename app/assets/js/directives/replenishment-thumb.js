function ReplenishmentThumbDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '=',
			quantity: '=',
			supplier: '=',
			checked: '='
		},
		controller: function(replenishmentService) {
			var vm = this;
			var initialQuantity = vm.quantity;

			vm.product.id = vm.product.objectID;

			vm.product.thumbnail_image_url = API.product_images + vm.product.id + '.jpg';

			vm.changeQuantity = function(quantity) {
				vm.quantity += quantity;
				if (vm.quantity < 0) {
					vm.quantity = 0;
				}
			};

			vm.trapClick = function($event) {
				$event.preventDefault();
				$event.stopPropagation();
			};

			vm.replenishItem = function() {
				replenishmentService
					.replenishSingleItem({
						product: vm.product,
						quantity: vm.quantity
					});
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
