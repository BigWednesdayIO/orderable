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
				$q.all(vm.suppliers.map(function(supplier) {
					return suppliersService
						.getLoyaltySchemeForSupplier(supplier);
				}))
					.then(function(loyaltySchemes) {
						return membershipsService
							.getMemberships()
							.then(function(memberships) {
								return loyaltySchemes.filter(function(loyaltyScheme) {
									return !!loyaltyScheme;
								}).map(function(loyaltyScheme) {
									var number = _.result(_.findWhere(memberships, {supplier_id: loyaltyScheme.supplier.id}), 'membership_number');

									if (number) {
										loyaltyScheme.number = number;
									}

									return loyaltyScheme;
								});
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
