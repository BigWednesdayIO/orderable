function SearchController ($rootScope, $stateParams, $location, suppliersService, searchService, searchResponse) {
	var vm = this;

	function bindSearchResponse (response) {
		vm.facets = response.facets;

		vm.suppliers = response.suppliers;

		vm.hitsBySupplier = response.hitsBySupplier;

		vm.hits = response.hits;

		vm.search = $location.search();
	}

	bindSearchResponse(searchResponse);

	vm.applyRefinementToUrl = searchService.applyRefinementToUrl;

	vm.removeRefinementFromUrl = searchService.removeRefinementFromUrl;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	$rootScope.$on('$locationChangeSuccess', function() {
		searchService
			.getResults({
				query: $stateParams.query,
				filters: searchService.getFiltersFromUrl()
			})
			.then(bindSearchResponse);
	})
}

SearchController.resolve = /* @ngInject */ {
	searchResponse: function($stateParams, searchService) {
		return searchService
			.getResults({
				query: $stateParams.query,
				filters: searchService.getFiltersFromUrl()
			});
	}
};

angular
	.module('app')
	.controller('SearchController', SearchController);
