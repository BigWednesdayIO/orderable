function PriceDirective ($parse) {
	return {
		restrict: 'A',
		scope: {
			product: '='
		},
		templateUrl: 'views/partials/price.html'
	}
}

angular
	.module('app')
	.directive('price', PriceDirective);
