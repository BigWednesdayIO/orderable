function SearchController ($rootScope, $stateParams, $location, suppliersService, searchService, sortOptions, searchResponse) {
	var vm = this;

	function bindSearchResponse (response) {
		vm.facets = response.facets;

		vm.suppliers = response.suppliers;

		vm.hitsBySupplier = response.hitsBySupplier;

		vm.hits = response.hits;

		vm.totalHits = response.totalHits;

		vm.search = $location.search();
	}

	bindSearchResponse(searchResponse);

	vm.applyRefinementToUrl = searchService.applyRefinementToUrl;

	vm.removeRefinementFromUrl = searchService.removeRefinementFromUrl;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.sortOptions = sortOptions;

	vm.sortBy = vm.search.sort || sortOptions[0].value;

	vm.applySort = function() {
		$location.url(searchService.applyRefinementToUrl('sort', vm.sortBy));
	};

	$rootScope.$on('$locationChangeSuccess', function() {
		searchService
			.getResults({
				query: $stateParams.query,
				filters: searchService.getFiltersFromUrl(),
				sort: searchService.getSortOptionFromUrl()
			})
			.then(bindSearchResponse);
	})
}

SearchController.resolve = /* @ngInject */ {
	searchResponse: function($stateParams, searchService) {
		return searchService
			.getResults({
				query: $stateParams.query,
				filters: searchService.getFiltersFromUrl(),
				sort: searchService.getSortOptionFromUrl()
			});
	}
};

angular
	.module('app')
	.controller('SearchController', SearchController);
