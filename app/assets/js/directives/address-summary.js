function AddressSummaryDirective () {
	return {
		restrict: 'EA',
		scope: {
			address: '='
		},
		controller: function() {
			var vm = this;

			vm.addressLines = [
				'name',
				// 'email',
				'company',
				'line_1',
				'line_2',
				'line_3',
				'city',
				'region',
				'postcode'
			];
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/address-summary.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('addressSummary', AddressSummaryDirective);
