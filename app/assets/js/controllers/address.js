function AddressController ($mdDialog, $q, address, extraFields) {
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
}

angular
	.module('app')
	.controller('AddressController', AddressController);
