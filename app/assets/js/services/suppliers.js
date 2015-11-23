function SuppliersService ($rootScope, $q, browserStorage) {
	var service = {},
		currentSuppliers = browserStorage.getItem('suppliers') || [];

	service.saveSuppliers = function(suppliers) {
		currentSuppliers = suppliers;
		browserStorage.setItem('suppliers', currentSuppliers);
		$rootScope.$emit('suppliersUpdated', currentSuppliers);
	}

	service.getSuppliersForPostcode = function(postcode) {
		var suppliers = [],
			londonPostcodes = /^(w(1[0-4]?|[2-9])|sw(1[0-9]?|20?|[3-9])|se(1[0-9]?|2[0-8]?|[3-9])|nw(1[01]?|[2-9])|n(1[0-9]?|2[0-2]?|[3-9])|e(1[0-9]?|20?|[3-9]?)|ec[124][amnprvy]|ec3[amnprv]|wc1[abehnr]|wc2[abehnrvx])/i;

		if (postcode.match(londonPostcodes)) {
			suppliers = [
				'Pub Taverns',
				'Beer & Wine Co',
				'Walmart',
				'Best Buy'
			];
		}

		return $q.when(suppliers);
	};

	service.getCurrentSuppliers = function() {
		return currentSuppliers;
	};

	service.getLogoForSupplier = function(supplier) {
		var logos = {
			'Pub Taverns': 'assets/images/pub-buying-club-logo.jpg',
			'Beer & Wine Co': 'assets/images/beer-and-wine-co-logo.jpg',
			'Best Buy': 'assets/images/best-buy-logo.png',
			'Walmart': 'assets/images/walmart-logo.png',
			'placeholder': 'http://placehold.it/80x80'
		};

		return logos[supplier] || logos.placeholder;
	};

	service.getBrandImageForSupplier = function(supplier) {
		var brandImage = {
			'Pub Taverns': 'assets/images/pub-buying-club-logo.jpg',
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