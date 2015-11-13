function HomepageController (suppliersService, supplierList, featuredSupplierProducts) {
	var vm = this;

	vm.suppliers = supplierList.map(function(supplier) {
		return {
			name: supplier,
			logo: suppliersService.getLogoForSupplier(supplier)
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
		return $http.get('assets/images/orderable-hero.jpg');
	}
};

angular
	.module('app')
	.controller('HomepageController', HomepageController);
