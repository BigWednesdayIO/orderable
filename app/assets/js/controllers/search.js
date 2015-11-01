function SearchController ($location, searchService, searchResponse) {
	var vm = this;

	vm.facets = searchResponse.facets;

	vm.suppliers = searchResponse.suppliers;
	vm.hitsBySupplier = searchResponse.hits_by_supplier;

	vm.hits = searchResponse.hits.map(function(hit) {
		return {
			product: hit,
			quantity: 0
		};
	});

	vm.applyRefinementToUrl = searchService.applyRefinementToUrl;
}

SearchController.resolve = /* @ngInject */ {
	searchResponse: function($stateParams, searchService) {
		return searchService
			.getResults({
				query: $stateParams.query
			});
	}
};

angular
	.module('app')
	.controller('SearchController', SearchController);
