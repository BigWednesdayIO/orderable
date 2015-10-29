function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider
		.state('shop', {
			views: {
				'body@': {
					templateUrl: 'views/layouts/shop.html'
				}
			}
		})
		.state('home', {
			parent: 'shop',
			url: '/',
			views: {
				'main@shop': {
					templateUrl: 'views/index.html'
				}
			}
		});

	$urlRouterProvider.otherwise("/");

	$locationProvider.html5Mode(true);
}

angular
	.module('app')
	.config(RoutingConfig);
