function SuppliersService ($rootScope, $http, $q, API, browserStorage) {
	var service = {},
		currentSuppliers = browserStorage.getItem('suppliers') || [];

	service.saveSuppliers = function(suppliers) {
		currentSuppliers = suppliers;
		browserStorage.setItem('suppliers', currentSuppliers);
		$rootScope.$emit('suppliersUpdated', currentSuppliers);
	}

	service.getAllSuppliers = function() {
		return $http({
			method: 'GET',
			url: API.suppliers,
			cache: true
		});
	};

	service.getSuppliersForPostcode = function(postcode) {
		return $http({
			method: 'GET',
			url: API.suppliers,
			params: {
				deliver_to: postcode.replace(/\s/g, '')
			}
		})
			.catch(function() {
				// Just until the API's working
				return [
					'Pub Taverns',
					'Beer & Wine Co',
					'Walmart',
					'Best Buy'
				]
			});
	};

	service.getCurrentSuppliers = function() {
		return currentSuppliers;
	};

	service.getLogoForSupplier = function(supplier) {
		var logos = {
			'Pub Taverns': 'assets/images/pub-buying-club-logo.svg',
			'Beer & Wine Co': 'assets/images/beer-and-wine-co-logo.jpg',
			'Best Buy': 'assets/images/best-buy-logo.png',
			'Walmart': 'assets/images/walmart-logo.png',
			'placeholder': 'http://placehold.it/80x80?text='
		};

		return logos[supplier] || logos.placeholder + supplier;
	};

	service.getBrandImageForSupplier = function(supplier) {
		var brandImage = {
			'Pub Taverns': 'assets/images/pub-buying-club-logo.svg',
			'Beer & Wine Co': 'assets/images/beer-and-wine-co-logo.jpg',
			'Best Buy': 'assets/images/best-buy-tile.png',
			'Walmart': 'assets/images/walmart-tile.jpg',
			'placeholder': 'http://placehold.it/86x60?text='
		};

		return brandImage[supplier] || brandImage.placeholder + supplier;
	};

	service.getLoyaltySchemeForSupplier = function(supplier) {
		return {
			supplier: supplier,
			logo: service.getLogoForSupplier(supplier),
			brandImage: service.getBrandImageForSupplier(supplier),
			name: supplier + ' Rewards',
			label: supplier + ' Rewards number'
		};
	};

	return service;
}

angular
	.module('app')
	.factory('suppliersService', SuppliersService);