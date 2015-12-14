function HomepageController (customerService, suppliersService, supplierList, featuredSupplierProducts) {
	var vm = this;

	vm.isSignedIn = customerService.isSignedIn();

	vm.suppliers = supplierList.map(function(supplier) {
		return {
			name: supplier,
			logo: suppliersService.getLogoForSupplier(supplier),
			href: 'search/?supplier=' + encodeURIComponent(supplier)
		};
	});

	vm.featuredSupplierProducts = featuredSupplierProducts;
}

HomepageController.resolve = /* @ngInject */ {
	featuredSupplierProducts: function($q, supplierList, searchService) {
		return $q.all(supplierList.map(function(supplier) {
			return searchService
				.getResults({
					filters: [{
						field: 'supplier',
						term: supplier
					}]
				})
				.then(function(response) {
					return response.hits;
				});
		}))
			.then(function(response) {
				return response.map(function(hits, index) {
					return {
						supplier: supplierList[index],
						hits: hits
					};
				});
			});
	},
	homepageHero: function($http) {
		return $http({
			method: 'GET',
			url: 'assets/images/orderable-hero.jpg',
			cache: true
		});
	}
};

angular
	.module('app')
	.controller('HomepageController', HomepageController);
