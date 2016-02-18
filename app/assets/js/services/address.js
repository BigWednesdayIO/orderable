function AddressService ($mdDialog, $http, $q, API, customerService) {
	var service = this;

	service.getAddressBook = function() {
		return customerService
			.getUpToDateInfo()
			.then(function(info) {
				return info.addresses;
			});
	};

	service.editAddress = function($event, address, extraFields) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/address-form.html',
				controller: 'AddressController',
				controllerAs: 'vm',
				locals: {
					address: angular.copy(address),
					extraFields: extraFields
				},
				clickOutsideToClose: true
			});
	};

	service.updateAddressBook = function(addresses) {
		return customerService
			.updateInfo({
				addresses: addresses
			})
			.then(function(updatedInfo) {
				return updatedInfo.addresses;
			});
	};

	service.lookupPostcode = function(postcode) {
		return $http({
			method: 'GET',
			url: API.addressLookup + '/' + postcode,
			params: {
				'api-key': 	'X7MEgMQ4D0aH2hv1A983XA3284',
				'format': true
			}
		})
			.then(function(results) {
				return results.Addresses;
			});
	};
}

angular
	.module('app')
	.service('addressService', AddressService);
