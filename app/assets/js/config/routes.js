function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider, $provide, isApp) {
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
			url: '/search/?query',
			views: {
				body: {
					controller: 'SearchController as vm',
					resolve: SearchController.resolve,
					templateUrl: 'views/search.html'
				}
			}
		});

	$urlRouterProvider.otherwise("/");

	$locationProvider.html5Mode({
		enabled: true,
		rewriteLinks: true
	});

	if (isApp) {
		$provide.decorator('$sniffer', function($delegate) {
			$delegate.history = false;
			return $delegate;
		});

		$locationProvider.hashPrefix('!');
	}
}

angular
	.module('app')
	.config(RoutingConfig);
