function AccountSettingsController (suppliersService) {
	var vm = this;

	vm.suppliers = suppliersService.getCurrentSuppliers();
}

AccountSettingsController.resolve = /* @ngInject */ {
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('AccountSettingsController', AccountSettingsController);
