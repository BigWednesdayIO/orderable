function AddressService ($mdDialog, $http, $q, API, customerService, _) {
	var service = this;

	function cleanAddresses (addresses) {
		return addresses.map(function(address) {
			Object.keys(address).forEach(function(key) {
				if (address[key] === '') {
					delete address[key];
				}
			})
			return address;
		});
	}

	service.getAddressBook = function() {
		return customerService
			.getUpToDateInfo()
			.then(function(info) {
				return info.addresses;
			});
	};

	service.getDefaultAddress = function(addresses) {
		return (addresses ? $q.when(addresses) : service.getAddressBook())
			.then(function(addressBook) {
				if (!addressBook) {
					return;
				}
				return _.find(addressBook, {default_billing: true, default_delivery: true}) || addressBook[0];
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
				addresses: cleanAddresses(addresses)
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
