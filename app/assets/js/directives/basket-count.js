function basketCountDirective ($rootScope) {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($scope, basketService) {
			$scope.basket = basketService.basket;
		},
		link: function(scope, element) {
			$rootScope.$on('basketUpdated', function(event, count) {
				element.removeClass('basket-updated-0 basket-updated-1');
				if (count > 0) {
					element.addClass('basket-updated-' + count % 2);
				}
			});
		},
		template: '{{ basket.line_item_count }}'
	};
}

angular
	.module('app')
	.directive('basketCount', basketCountDirective);
