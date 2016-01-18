function SupplierInfoController ($mdDialog, supplierInfo) {
	var vm = this;

	vm.supplier = supplierInfo;

	vm.done = $mdDialog.hide;
}

angular
	.module('app')
	.controller('SupplierInfoController', SupplierInfoController);
