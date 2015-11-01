function SearchController (searchResponse) {
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
}

SearchController.resolve = /* @ngInject */ {
	searchResponse: function(searchService) {
		return searchService
			.getResults({});
	}
};

angular
	.module('app')
	.controller('SearchController', SearchController);
