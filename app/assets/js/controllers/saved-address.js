function SavedAddressController (addressService, customerAddress) {
	var vm = this;

	vm.address = customerAddress;

	vm.editAddress = function($event) {
		addressService
			.editAddress($event, vm.address)
			.then(function(newAddress) {
				return addressService
					.updateSavedAddress(newAddress);
			})
			.then(function(updatedAddress) {
				vm.address = updatedAddress;
			});
	};
}

SavedAddressController.resolve = /* @ngInject */ {
	customerAddress: function(addressService) {
		return addressService
			.getSavedAddress();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('SavedAddressController', SavedAddressController);
