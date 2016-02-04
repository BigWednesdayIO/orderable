function HomepageController (customerService, suppliersService, replenishmentService, availableSuppliers, featuredSupplierProducts, replenishmentItems) {
	var vm = this;

	vm.isSignedIn = customerService.isSignedIn();

	vm.suppliers = availableSuppliers.map(function(supplier) {
		supplier.href = 'search/?supplier_id=' + encodeURIComponent(supplier.id);
		return supplier;
	});

	vm.featuredSupplierProducts = featuredSupplierProducts;

	vm.replenishmentItems = replenishmentItems;

	vm.replenishAllItems = function() {
		replenishmentService
			.replenish(vm.replenishmentItems);
	};
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
						field: 'supplier_id',
						term: supplier.id
					}]
				})
				.then(function(response) {
					return response.hits;
				});
		}))
			.then(function(response) {
				return response.map(function(hits, index) {
					return {
						supplier: availableSuppliers[index].id,
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
	},
	replenishmentItems: function(customerService, replenishmentService) {
		if (!customerService.isSignedIn()) {
			return [];
		}

		return replenishmentService
			.getReplenishmentItems()
			.catch(function() {
				return [];
			});
	}
};

angular
	.module('app')
	.controller('HomepageController', HomepageController);
