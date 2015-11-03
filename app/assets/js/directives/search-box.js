function SearchBoxDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($element, $state, searchService) {
			var vm = this,
				$input;

			vm.getSearchSuggestions = searchService.getSearchSuggestions;

			vm.performSearch = function(query) {
				$state.go('search', {
					query: query
				});
				if (!$input) {
					$input = $element.find('input');
				}
				$input.blur();
			};

			vm.searchIconClick = function() {
				if (!vm.query || vm.query === '') {
					if (!$input) {
						$input = $element.find('input');
					}
					$input.focus();
					return;
				}

				vm.performSearch(vm.query);
			};

			vm.searchSubmit = function($event) {
				$event.preventDefault();

				if (!vm.query || vm.query === '') {
					return;
				}

				vm.performSearch(vm.query);
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
