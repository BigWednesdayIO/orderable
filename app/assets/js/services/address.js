function AddressService ($mdDialog, $q) {
	var service = this;

	service.editAddress = function($event, address, extraFields) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/address-form.html',
				controller: 'AddressController',
				controllerAs: 'vm',
				locals: {
					address: angular.copy(address),
					extraFields: extraFields
				},
				clickOutsideToClose: true
			});
	}
}

angular
	.module('app')
	.service('addressService', AddressService);
