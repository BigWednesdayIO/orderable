function LoyaltyListDirective () {
	return {
		restrict: 'EA',
		scope: {
			suppliers: '='
		},
		controller: function($scope, suppliersService) {
			var vm = this;

			function getLoyaltySchemes () {
				return vm.suppliers.map(function(supplier) {
					return suppliersService
						.getLoyaltySchemeForSupplier(supplier);
				}).filter(function(loyaltyScheme) {
					return !!loyaltyScheme;
				});
			}

			$scope.$watch(function() {
				return vm.suppliers;
			}, function() {
				vm.loyaltySchemes = getLoyaltySchemes();
			});
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/loyalty-list.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('loyaltyList', LoyaltyListDirective);
