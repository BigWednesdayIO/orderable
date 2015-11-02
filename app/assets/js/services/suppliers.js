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
				'Beer & Wine Co'
			];
		}

		return $q.when(suppliers);
	};

	service.getCurrentSuppliers = function() {
		return currentSuppliers;
	};

	return service;
}

angular
	.module('app')
	.factory('suppliersService', SuppliersService);