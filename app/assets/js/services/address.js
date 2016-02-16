function AddressService ($mdDialog, $q, customerService) {
	var service = this;

	service.getSavedAddress = function() {
		return customerService
			.getUpToDateInfo()
			.then(function(info) {
				return info.address;
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

	service.updateSavedAddress = function(address) {
		return customerService
			.updateInfo({
				address: address
			})
			.then(function(updatedInfo) {
				return updatedInfo.address;
			});
	};
}

angular
	.module('app')
	.service('addressService', AddressService);
