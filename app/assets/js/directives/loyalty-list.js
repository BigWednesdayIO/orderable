function LoyaltyListDirective () {
	return {
		restrict: 'EA',
		scope: {
			suppliers: '=',
			loyaltySchemes: '='
		},
		controller: function($scope, $q, suppliersService, membershipsService) {
			var vm = this;

			function getLoyaltySchemes () {
				$q.all([
					suppliersService
						.getLoyaltySchemesForSuppliers(vm.suppliers),
					membershipsService
						.getMemberships()
				])
					.then(function(promises) {
						var loyaltySchemes = promises[0];
						var memberships = promises[1].reduce(function(lookup, membership) {
							lookup[membership.supplier_id] = membership;
							return lookup;
						}, {});

						return loyaltySchemes.map(function(loyaltyScheme) {
							var number = (memberships[loyaltyScheme.supplier.id] || {}).membership_number;

							if (number) {
								loyaltyScheme.number = number;
							}

							return loyaltyScheme;
						});
					})
					.then(function(loyaltySchemes) {
						vm.loyaltySchemes = loyaltySchemes;
					});
			}

			$scope.$watch(function() {
				return vm.suppliers;
			}, getLoyaltySchemes);
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
