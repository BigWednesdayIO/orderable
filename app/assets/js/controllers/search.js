function SearchController ($rootScope, $scope, $stateParams, $location, $element, suppliersService, searchService, sortOptions, searchResponse) {
	var vm = this,
		searchPage = 1,
		raw = $element[0],
		threshold = 400,
		supplierList;

	function getSearchResults () {
		return searchService
			.getResults({
				query: $stateParams.query,
				filters: searchService.getFiltersFromUrl(),
				sort: searchService.getSortOptionFromUrl(),
				page: searchPage
			})
	}

	function loadNextPage () {
		if (vm.loadingNextPage || vm.hits.length === vm.totalHits) {
			return;
		}

		vm.loadingNextPage = true;
		searchPage++;

		getSearchResults()
			.then(function(response) {
				vm.hits = vm.hits.concat(response.hits);
				vm.loadingNextPage = false;
			});
	}

	function getSupplierListHeight () {
		// Can't rely on element existing in MVC
		if (!supplierList) {
			supplierList = raw.getElementsByClassName('supplier-listing')[0];
		}

		return supplierList.offsetHeight;
	}

	function checkScrollPosition () {
		var scrolled = raw.scrollTop + raw.offsetHeight;
		var minimumScrollNeeded = raw.scrollHeight - threshold;

		if (scrolled >= minimumScrollNeeded || scrolled >= getSupplierListHeight()) {
			loadNextPage();
		}
	}

	function bindSearchResponse (response) {
		vm.facets = response.facets;

		vm.suppliers = response.suppliers;

		vm.hitsBySupplier = response.hitsBySupplier;

		vm.hits = response.hits;

		vm.totalHits = response.totalHits;

		vm.search = $location.search();

		if (vm.search.supplier_id) {
			$element.on('scroll', checkScrollPosition);
		} else {
			$element.off('scroll', checkScrollPosition);
		}
	}

	function updateSearchResults () {
		searchPage = 1;
		getSearchResults()
			.then(bindSearchResponse);
		vm.showMobileRefinement = false;
	}

	bindSearchResponse(searchResponse);

	vm.applyRefinementToUrl = searchService.applyRefinementToUrl;

	vm.removeRefinementFromUrl = searchService.removeRefinementFromUrl;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	vm.sortOptions = sortOptions;

	vm.sortBy = vm.search.sort || sortOptions[0].value;

	vm.applySort = function(value) {
		if (value) {
			vm.sortBy = value;
		}

		$location.url(searchService.applyRefinementToUrl('sort', vm.sortBy));
	};

	$rootScope.$on('$locationChangeSuccess', updateSearchResults);
	$rootScope.$on('suppliersUpdated', updateSearchResults);

	$scope.$on('$destroy', function() {
		$element.off('scroll', checkScrollPosition);
	});
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
