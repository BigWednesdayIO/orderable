function BreadcrumbsController ($rootScope, breadcrumbsService) {
	var vm = this;

	function updateCrumbs () {
		vm.breadcrumbs = [];

		breadcrumbsService
			.getBreadcrumbs()
			.then(function(breadcrumbs) {
				vm.breadcrumbs = breadcrumbs;
			});
	}

	$rootScope.$on('$stateChangeSuccess', updateCrumbs);
	updateCrumbs();
}

angular
	.module('app')
	.controller('BreadcrumbsController', BreadcrumbsController);
