function BreadcrumbsDirective () {
	return {
		restrict: 'EA',
		scope: {
			breadcrumbs: '=crumbs'
		},
		controller: function() {
			var vm = this;
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/breadcrumbs.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('breadcrumbs', BreadcrumbsDirective);
