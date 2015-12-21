function HomepageController (customerService, suppliersService, availableSuppliers, featuredSupplierProducts) {
	var vm = this;

	vm.isSignedIn = customerService.isSignedIn();

	vm.suppliers = availableSuppliers.map(function(supplier) {
		supplier.logo = suppliersService.getLogoForSupplier(supplier.name);
		supplier.href = 'search/?supplier=' + encodeURIComponent(supplier.name);
		return supplier;
	});

	vm.featuredSupplierProducts = featuredSupplierProducts;
}

HomepageController.resolve = /* @ngInject */ {
	availableSuppliers: function(suppliersService) {
		return suppliersService
			.getAllSuppliers()
	},
	featuredSupplierProducts: function($q, searchService, availableSuppliers) {
		return $q.all(availableSuppliers.map(function(supplier) {
			return searchService
				.getResults({
					filters: [{
						field: 'supplier',
						term: supplier.name
					}]
				})
				.then(function(response) {
					return response.hits;
				});
		}))
			.then(function(response) {
				return response.map(function(hits, index) {
					return {
						supplier: availableSuppliers[index].name,
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
