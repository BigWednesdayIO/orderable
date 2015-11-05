function basketCountDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($scope, basketService) {
			$scope.basket = basketService.basket;
		},
		template: '{{ basket.line_item_count }}'
	};
}

angular
	.module('app')
	.directive('basketCount', basketCountDirective);
