function FeaturedSuppliersDirective () {
	return {
		restrict: 'EA',
		scope: {
			category: '='
		},
		controller: function(searchService) {
			var vm = this;

			(function() {
				var match = (vm.category.href || '').match(/category_hierarchy=([.0-9]+)(&|$)/),
					category_code = match && match[1];

				if (!category_code) {
					return;
				}

				searchService
					.getSuppliersForCategory(category_code)
					.then(function(featuredSuppliers) {
						vm.featuredSuppliers = featuredSuppliers;
					});
			})();
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/featured-suppliers.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('featuredSuppliers', FeaturedSuppliersDirective);
