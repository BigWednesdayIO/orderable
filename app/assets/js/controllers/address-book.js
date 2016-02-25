function AddressBookController ($mdToast, addressService, addressBook) {
	var vm = this;

	function syncAddressBook (newAddressBook) {
		return addressService
			.updateAddressBook(newAddressBook)
			.then(function(updatedAddressBook) {
				vm.addresses = updatedAddressBook;
				return updatedAddressBook;
			});	
	}

	function offerUndo (undo) {
		return $mdToast.show(
			$mdToast.simple()
				.content('Address deleted')
				.action('undo')
				.hideDelay(3000)
		)
			.then(function(response) {
				if (response === 'ok') {
					return undo();
				}
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
		var addressToRemove = newAddressBook[$index];

		function undo () {
			newAddressBook.splice($index, 0, addressToRemove);
			return syncAddressBook(newAddressBook);
		}

		newAddressBook.splice($index, 1);
		return syncAddressBook(newAddressBook)
			.then(function() {
				return offerUndo(undo);
			});
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
