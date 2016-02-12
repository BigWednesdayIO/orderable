function SavedAddressController (addressService, customerService, customerAddress) {
	var vm = this;

	vm.address = customerAddress;

	vm.editAddress = function($event) {
		addressService
			.editAddress($event, vm.address)
			.then(function(newAddress) {
				return customerService
					.updateInfo({
						address: newAddress
					});
			})
			.then(function(updatedInfo) {
				vm.address = updatedInfo.address;
			});
	};
}

SavedAddressController.resolve = /* @ngInject */ {
	customerAddress: function(customerService) {
		return customerService
			.getInfo()
			.then(function(info) {
				return info.address;
			});
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('SavedAddressController', SavedAddressController);
