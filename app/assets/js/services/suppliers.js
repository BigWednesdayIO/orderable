function SuppliersService ($rootScope, $mdToast, $http, $q, API, browserStorage, _) {
	var service = {},
		currentSuppliers = browserStorage.getItem('suppliers') || [],
		pinnedSuppliers;

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}

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
		})
			.then(function(suppliers) {
				return suppliers.map(function(supplier) {
					supplier.logo = service.getLogoForSupplier(supplier.name);
					supplier.brand_image = service.getBrandImageForSupplier(supplier.name);
					return supplier;
				});
			})
			.catch(notifyError);
	};

	service.getSuppliersForPostcode = function(postcode) {
		return $http({
			method: 'GET',
			url: API.suppliers,
			params: {
				deliver_to: postcode.replace(/\s/g, '')
			}
		})
			.catch(notifyError);
	};

	service.getCurrentSuppliers = function() {
		return currentSuppliers;
	};

	service.getSupplierInfo = function(id) {
		return service
			.getAllSuppliers()
			.then(function(suppliers) {
				var supplier = _.find(suppliers, {id: id});
				if (!supplier) {
					return $q.reject(supplier);
				}
				supplier.logo = service.getLogoForSupplier(supplier.name);
				supplier.brand_image = service.getBrandImageForSupplier(supplier.name);
				return supplier;
			});
	};

	service.getNameForSupplier = function(id) {
		return service
			.getSupplierInfo(id)
			.then(function(supplier) {
				return supplier.name;
			})
			.catch(function() {
				return;
			});
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
		return $q.when({
			supplier: supplier,
			logo: service.getLogoForSupplier(supplier),
			brandImage: service.getBrandImageForSupplier(supplier),
			name: supplier.name,
			label: supplier.name + ' membership number'
		});
	};

	service.getPinnedSuppliers = function() {
		if (!pinnedSuppliers) {
			pinnedSuppliers = browserStorage.getItem('pinnedSuppliers') || [];
		}
		return $q.when(pinnedSuppliers);
	};

	service.togglePinnedSupplier = function(supplier) {
		return service
			.getPinnedSuppliers()
			.then(function(latestPins) {
				var index = _.findIndex(latestPins, {id: supplier.id});

				if (index > -1) {
					latestPins.splice(index, 1);
				} else {
					latestPins.push(supplier);
				}

				pinnedSuppliers = latestPins;
				browserStorage.setItem('pinnedSuppliers', pinnedSuppliers);
				return $q.when(pinnedSuppliers);
			});
	};

	return service;
}

angular
	.module('app')
	.factory('suppliersService', SuppliersService);