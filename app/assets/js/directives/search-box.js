function SearchBoxDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($state) {
			var vm = this;

			vm.search = function() {
				if (!vm.query || vm.query === '') {
					return;
				}

				$state.go('search', {
					query: vm.query
				});
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/search-box.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('searchBox', SearchBoxDirective);
