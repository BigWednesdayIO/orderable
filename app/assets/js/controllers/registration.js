function RegistrationController (customerService, linesOfBusiness) {
	var vm = this;

	vm.linesOfBusiness = linesOfBusiness;

	vm.register = function($event) {
		customerService
			.register(vm.userDetails);
	};
}

angular
	.module('app')
	.controller('RegistrationController', RegistrationController);
