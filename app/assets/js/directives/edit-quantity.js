function EditQuantityDirective () {
	return {
		restrict: 'EA',
		scope: {
			quantity: '=',
			hover: '='
		},
		controller: function($scope) {
			var vm = this;

			vm.changeQuantity = function($event, quantity) {
				$event.preventDefault();
				vm.quantity += quantity;
				if (vm.quantity < 0) {
					vm.quantity = 0;
				}
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/quantity.html'
	};
}

angular
	.module('app')
	.directive('editQuantity', EditQuantityDirective);
