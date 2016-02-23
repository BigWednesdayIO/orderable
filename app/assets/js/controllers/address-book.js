function AddressBookController (addressService, addressBook) {
	var vm = this;

	function syncAddressBook (newAddressBook) {
		return addressService
			.updateAddressBook(newAddressBook)
			.then(function(updatedAddressBook) {
				vm.addresses = updatedAddressBook;
				return updatedAddressBook;
			});	
	}

	vm.addresses = addressBook || [];

	vm.editAddress = function($event, index) {
		var address = vm.addresses[index] || {};
		var newAddressBook = angular.copy(vm.addresses);

		return addressService
			.editAddress($event, address)
			.then(function(newAddress) {
				if (newAddress.default_billing && newAddress.default_delivery) {
					newAddressBook = newAddressBook.map(function(addr) {
						addr.default_delivery = false;
						addr.default_billing = false;
						return addr;
					});
				}

				if (index > -1) {
					newAddressBook[index] = newAddress;
				} else {
					newAddressBook.push(newAddress);
				}

				return syncAddressBook(newAddressBook);
			});
	};

	vm.removeAddress = function($index) {
		var newAddressBook = angular.copy(vm.addresses);

		newAddressBook.splice($index, 1);
		return syncAddressBook(newAddressBook);
	};
}

AddressBookController.resolve = /* @ngInject */ {
	addressBook: function(addressService) {
		return addressService
			.getAddressBook();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('AddressBookController', AddressBookController);
