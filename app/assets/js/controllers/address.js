function AddressController ($mdDialog, $q, address) {
	var vm = this;

	vm.address = address;

	vm.cancel = function() {
		$mdDialog
			.hide($q.reject());
	};

	vm.save = function() {
		$mdDialog
			.hide(vm.address);
	};
}

angular
	.module('app')
	.controller('AddressController', AddressController);
