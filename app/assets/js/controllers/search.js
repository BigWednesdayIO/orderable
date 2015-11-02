function SearchController ($rootScope, $stateParams, $location, searchService, searchResponse) {
	var vm = this;

	function bindSearchResponse (response) {
		vm.facets = response.facets;

		vm.suppliers = response.suppliers;
		vm.hitsBySupplier = response.hitsBySupplier;

		vm.hits = response.hits.map(function(hit) {
			return {
				product: hit,
				quantity: 0
			};
		});

		vm.search = $location.search();
	}

	bindSearchResponse(searchResponse);

	vm.applyRefinementToUrl = searchService.applyRefinementToUrl;
	vm.removeRefinementFromUrl = searchService.removeRefinementFromUrl;

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
