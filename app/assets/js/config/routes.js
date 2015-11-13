function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider, $provide, isApp) {
	$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomepageController as vm',
			resolve: HomepageController.resolve,
			templateUrl: 'views/index.html'
		})
		.state('search', {
			url: '/search/?query',
			controller: 'SearchController as vm',
			resolve: SearchController.resolve,
			templateUrl: 'views/search.html'
		})
		.state('product-details', {
			url: '/product/:id',
			controller: 'ProductDetailsController as vm',
			resolve: ProductDetailsController.resolve,
			templateUrl: 'views/product-details.html'
		})
		.state('basket', {
			url: '/basket/',
			controller: 'BasketController as vm',
			resolve: BasketController.resolve,
			templateUrl: 'views/basket.html'
		})
		.state('checkout', {
			url: '/checkout/',
			controller: 'CheckoutController as vm',
			resolve: CheckoutController.resolve,
			templateUrl: 'views/checkout.html'
		})
		.state('order-confirmation', {
			url: '/order-confirmation/:id/',
			controller: 'OrderConfirmationController as vm',
			resolve: OrderConfirmationController.resolve,
			templateUrl: 'views/order-confirmation.html'
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
