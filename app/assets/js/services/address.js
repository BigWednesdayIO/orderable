function AddressService ($mdDialog, $q) {
	var service = this;

	service.editAddress = function($event, address) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/address-form.html',
				controller: 'AddressController',
				controllerAs: 'vm',
				locals: {
					address: angular.copy(address)
				},
				clickOutsideToClose: true
			});
	}
}

angular
	.module('app')
	.service('addressService', AddressService);
