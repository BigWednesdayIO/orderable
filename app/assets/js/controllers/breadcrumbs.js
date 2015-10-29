function BreadcrumbsController ($rootScope, breadcrumbsService) {
	var vm = this;

	function updateCrumbs () {
		breadcrumbsService
			.getBreadcrumbs()
			.then(function(breadcrumbs) {
				vm.breadcrumbs = breadcrumbs;
			});
	}

	vm.breadcrumbs = [];

	$rootScope.$on('$stateChangeSuccess', updateCrumbs);
	updateCrumbs();
}

angular
	.module('app')
	.controller('BreadcrumbsController', BreadcrumbsController);
