function ScrollOnStateChangeDirective ($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			$rootScope.$on('$stateChangeSuccess', function() {
				element[0].scrollTo = 0;
			});
		}
	};
}

angular
	.module('app')
	.directive('scrollOnStateChange', ScrollOnStateChangeDirective);
