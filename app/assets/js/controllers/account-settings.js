function AccountSettingsController (suppliersService) {
	var vm = this;

	vm.suppliers = suppliersService.getCurrentSuppliers();
}

angular
	.module('app')
	.controller('AccountSettingsController', AccountSettingsController);
