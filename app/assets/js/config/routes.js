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
		.state('shop', {
			views: {
				'body@': {
					templateUrl: 'views/layouts/shop.html'
				}
			}
		})
		.state('search', {
			parent: 'shop',
			url: '/search',
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
