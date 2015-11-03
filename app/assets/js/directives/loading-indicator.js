function LoadingIndicatorDirective () {
	return {
		restrict: 'EA',
		scope: {},
		controller: function($http) {
			var vm = this;

			vm.pendingRequests = $http.pendingRequests;
		},
		controllerAs: 'vm',
		bindToController: true,
		template: '<md-progress-linear md-mode="{{ vm.pendingRequests.length ? \'indeterminate\' : \'\' }}" class=""></md-progress-linear>'
	};
}

angular
	.module('app')
	.directive('loadingIndicator', LoadingIndicatorDirective);
