function AddressController ($mdDialog, $q, address, addressService, extraFields) {
	var vm = this;

	vm.address = address;

	vm.extraFields = extraFields;

	vm.cancel = function() {
		$mdDialog
			.hide($q.reject());
	};

	vm.save = function(e) {
		if (e) {
			e.preventDefault();
		}

		if (vm.addressForm.$invalid) {
			return;
		}

		$mdDialog
			.hide(vm.address);
	};

	vm.lookupAddress = function() {
		return addressService
			.lookupPostcode(vm.postcode)
			.then(function(addresses) {
				vm.addresses = addresses;
			});
	};

	vm.addressSelected = function() {
		vm.hideLookup = true;
		vm.address.line_1 = vm.selectedAddress[0];
		vm.address.line_2 = vm.selectedAddress[1];
		vm.address.line_3 = vm.selectedAddress[2];
		vm.address.city = vm.selectedAddress[3];
		vm.address.region = vm.selectedAddress[4];
		vm.address.postcode = vm.postcode;
	};

	vm.isDefault = vm.address.default_delivery && vm.address.default_billing;

	vm.changeDefault = function() {
		vm.address.default_delivery = vm.isDefault;
		vm.address.default_billing = vm.isDefault;
	};

	vm.hideLookup = !!(address.name && address.line_1);
}

angular
	.module('app')
	.controller('AddressController', AddressController);
