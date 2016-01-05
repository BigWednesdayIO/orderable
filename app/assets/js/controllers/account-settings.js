function AccountSettingsController (suppliersService, membershipsService) {
	var vm = this;

	vm.suppliers = suppliersService.getCurrentSuppliers();

	vm.saveChanges = function() {
		return membershipsService
			.updateMemberships(vm.supplierMemberships.map(function(supplierMembership) {
				return {
					supplier_id: supplierMembership.supplier.id,
					membership_number: supplierMembership.number
				};
			}));
	};
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
