function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('home', {
			url: '/',
			view: {
				'@': {
					templateUrl: 'views/index.html'
				}
			}
		})
		.state('search', {
			url: '/search',
			views: {
				body: {
					controller: 'SearchController as vm',
					resolve: SearchController.resolve,
					templateUrl: 'views/search.html'
				}
			}
		});

	$urlRouterProvider.otherwise("/");

	$locationProvider.html5Mode(true);
}

angular
	.module('app')
	.config(RoutingConfig);
