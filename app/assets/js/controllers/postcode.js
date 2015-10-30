function PostcodeController ($mdDialog, postcodeService, suppliersService, brand) {
	var vm = this;

	vm.brand = brand;

	vm.choosePostcode = function() {
		suppliersService
			.getSuppliersForPostcode(vm.postcode)
			.then(function(suppliers) {
				if (!suppliers.length) {
					vm.unavailable = true;
					return;
				}
				suppliersService
					.saveSuppliers(suppliers);
				$mdDialog
					.hide(vm.postcode);
			});
	};

	vm.resetForm = function() {
		vm.postcodeForm.$submitted = false;
		vm.unavailable = false;
		vm.postcode = '';
	};

	vm.locationAlert = function() {

	};
}

angular
	.module('app')
	.controller('PostcodeController', PostcodeController);
