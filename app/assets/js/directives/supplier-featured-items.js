function SupplierFeaturedItemsDirective () {
	return {
		restrict: 'EA',
		scope: {
			supplier: '=',
			hits: '=',
			buttonText: '@'
		},
		controller: function(searchService, suppliersService) {
			var vm = this;

			vm.href = searchService.applyRefinementToUrl('supplier', vm.supplier);

			vm.logo = suppliersService.getLogoForSupplier(vm.supplier);
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/supplier-featured-items.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('supplierFeaturedItems', SupplierFeaturedItemsDirective);
