function SuppliersService ($q, browserStorage) {
	var service = {},
		currentSuppliers = browserStorage.getItem('suppliers');

	service.saveSuppliers = function(suppliers) {
		currentSuppliers = suppliers;
		browserStorage.setItem('suppliers', currentSuppliers);
	}

	service.getSuppliersForPostcode = function(postcode) {
		var suppliers = [];

		postcode = postcode.toLowerCase();

		if (postcode === 'ec2y 9ar') {
			suppliers = [
				'Pub Taverns',
				'Beer & Wine Co',
				'Wallmart',
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
			'placeholder': '//placehold.it/80x80'
		};

		return logos[supplier] || logos.placeholder;
	};

	service.getBrandImageForSupplier = function(supplier) {
		var brandImage = {
			'Pub Taverns': 'assets/images/pub-buying-club-logo.jpg',
			'Beer & Wine Co': 'assets/images/beer-and-wine-co-logo.jpg',
			'placeholder': '//placehold.it/86x60?text='
		};

		return brandImage[supplier] || brandImage.placeholder + supplier;
	};

	return service;
}

angular
	.module('app')
	.factory('suppliersService', SuppliersService);