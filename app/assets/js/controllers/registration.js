function RegistrationController (customerService, linesOfBusiness) {
	var vm = this;

	vm.linesOfBusiness = linesOfBusiness;

	vm.register = function($event) {
		customerService
			.register(vm.userDetails)
			.then(function(response) {
				console.log(response);
			});
	};
}

angular
	.module('app')
	.controller('RegistrationController', RegistrationController);
