function AccountSettingsController ($mdToast, $q, suppliersService, membershipsService, customerService, customerInfo) {
	var vm = this;

	vm.defaultSignFor = customerInfo.default_sign_for || false;

	vm.suppliers = suppliersService.getCurrentSuppliers();

	vm.saveChanges = function() {
		var updateMemberships = membershipsService
			.updateMemberships(vm.supplierMemberships.map(function(supplierMembership) {
				return {
					supplier_id: supplierMembership.supplier.id,
					membership_number: supplierMembership.number
				};
			}));

		var updateDefaultSignFor = customerService
			.updateInfo({
				default_sign_for: vm.defaultSignFor
			});

		return $q.all([
			updateMemberships,
			updateDefaultSignFor
		])
			.then(function() {
				return $mdToast.show(
					$mdToast.simple()
						.content('Settings updated')
				);
			});
	};
}

AccountSettingsController.resolve = /* @ngInject */ {
	customerInfo: function(customerService) {
		return customerService
			.getUpToDateInfo();
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('AccountSettingsController', AccountSettingsController);
