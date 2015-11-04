function ProductThumbDirective () {
	return {
		restrict: 'EA',
		scope: {
			product: '=',
			addToBasket: '='
		},
		link: function(scope, element) {
			element.addClass('product-thumb');
		},
		controller: function() {
			var vm = this;

			vm.product.image = '//placehold.it/180x180';
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-thumb.html'
	}
}

angular
	.module('app')
	.directive('productThumb', ProductThumbDirective);
