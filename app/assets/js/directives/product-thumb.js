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
		controller: function(productImageBaseUrl) {
			var vm = this;

			vm.product.image = (function(id) {
				if (!id) {
					return '//placehold.it/180x180';
				}
				id = id.slice(1);
				return productImageBaseUrl + '/' + id[0] + '/' + id[1] + '/' + id[2] + '/' + id + '_A_p.jpg';
			})(vm.product.objectID)

			vm.product.id = vm.product.objectID;
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/product-thumb.html'
	}
}

angular
	.module('app')
	.directive('productThumb', ProductThumbDirective);
