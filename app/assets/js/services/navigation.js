function NavigationService ($http, API) {
	var service = this;

	service.getNavigation = function() {
		return $http({
			method: 'GET',
			url: API.navigation,
			cache: true
		});
	};
}

angular
	.module('app')
	.service('navigationService', NavigationService);
