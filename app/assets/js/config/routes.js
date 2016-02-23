function RoutingConfig ($stateProvider, $urlRouterProvider, $locationProvider, $provide, isApp) {
	$stateProvider
		.state('home', {
			url: '/',
			controller: 'HomepageController as vm',
			resolve: HomepageController.resolve,
			templateUrl: 'views/index.html'
		})

		// Shop
		.state('search', {
			url: '/search/?query',
			controller: 'SearchController as vm',
			resolve: SearchController.resolve,
			templateUrl: 'views/search.html'
		})
		.state('product-details', {
			url: '/product/:id/',
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
			controller: 'OrderController as vm',
			resolve: OrderController.resolve,
			templateUrl: 'views/order-confirmation.html'
		})

		// Account
		.state('registration', {
			url: '/registration/?return_url',
			controller: 'RegistrationController as vm',
			templateUrl: 'views/registration.html'
		})
		.state('sign-in', {
			url: '/sign-in/?return_url',
			controller: 'SignInController as vm',
			templateUrl: 'views/sign-in.html'
		})
		.state('account-settings', {
			url: '/account/settings/',
			controller: 'AccountSettingsController as vm',
			resolve: AccountSettingsController.resolve,
			templateUrl: 'views/account-settings.html'
		})
		.state('address-book', {
			url: '/account/address-book/',
			controller: 'AddressBookController as vm',
			resolve: AddressBookController.resolve,
			templateUrl: 'views/address-book.html'
		})
		.state('open-orders', {
			url: '/account/orders/',
			controller: 'OpenOrdersController as vm',
			resolve: OpenOrdersController.resolve,
			templateUrl: 'views/open-orders.html'
		})
		.state('order-history', {
			url: '/account/orders/history/',
			controller: 'OrderHistoryController as vm',
			resolve: OrderHistoryController.resolve,
			templateUrl: 'views/order-history.html'
		})
		.state('order', {
			url: '/account/orders/:id/',
			controller: 'OrderController as vm',
			resolve: OrderController.resolve,
			templateUrl: 'views/order.html'
		})
		.state('purchase-order', {
			url: '/account/orders/:orderId/purchase-order/:id/?print',
			controller: 'PurchaseOrderController as vm',
			resolve: PurchaseOrderController.resolve,
			templateUrl: 'views/purchase-order.html'
		})

		;

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
