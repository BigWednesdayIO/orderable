function SuppliersService ($rootScope, $mdToast, $mdDialog, $http, $q, API, browserStorage, _) {
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

	function updateCurrentSuppliers () {
		var postcode = browserStorage.getItem('postcode');

		service
			.getSuppliersForPostcode(postcode)
			.then(function(suppliers) {
				var newLength = suppliers.length;
				var oldLength = currentSuppliers.length;

				_(suppliers)
					.sortBy('name')
					.forEach(function(supplier, i) {
						currentSuppliers[i] = supplier;
					})
					.value();

				if (oldLength > newLength) {
					currentSuppliers.splice(oldLength, oldLength - newLength);
				}

				browserStorage.setItem('suppliers', currentSuppliers);
			});
	}

	service.saveSuppliers = function(suppliers) {
		currentSuppliers = suppliers;
		browserStorage.setItem('suppliers', currentSuppliers);
		$rootScope.$emit('suppliersUpdated', currentSuppliers);
	};

	service.getAllSuppliers = function() {
		return $http({
			method: 'GET',
			url: API.suppliers,
			cache: true
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

	service.getLoyaltySchemeForSupplier = function(supplier) {
		return $q.when({
			supplier: supplier,
			name: supplier.name,
			label: supplier.name + ' membership number'
		});
	};

	service.getLoyaltySchemesForSuppliers = function(suppliers) {
		return service
			.getAllSuppliers()
			.then(function(upToDateSuppliers) {
				var supplierLookup = upToDateSuppliers.reduce(function(lookup, supplier) {
					lookup[supplier.id] = supplier;
					return lookup;
				}, {});

				var loyaltySchemes = suppliers.map(function(supplier) {
					return supplierLookup[supplier.id];
				}).filter(function(supplier) {
					return supplier && supplier.has_memberships;
				}).map(function(supplier) {
					return service
						.getLoyaltySchemeForSupplier(supplier);
				});

				return $q.all(loyaltySchemes);
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

	service.showSupplierInfoOverlay = function($event, id) {
		return $mdDialog.show({
			targetEvent: $event,
			templateUrl: 'views/partials/supplier-info.html',
			controller: 'SupplierInfoController',
			controllerAs: 'vm',
			resolve: {
				supplierInfo: function() {
					return service
						.getSupplierInfo(id)
				}
			},
			clickOutsideToClose: true
		});
	};

	updateCurrentSuppliers();

	return service;
}

angular
	.module('app')
	.factory('suppliersService', SuppliersService);