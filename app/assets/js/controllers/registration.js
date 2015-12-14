function RegistrationController ($stateParams, $location, customerService, linesOfBusiness) {
	var vm = this;

	vm.linesOfBusiness = linesOfBusiness;

	if ($stateParams.return_url) {
		vm.returnUrl = encodeURIComponent($stateParams.return_url);
	}

	vm.register = function($event) {
		customerService
			.register(vm.userDetails)
			.then(function() {
				$location.url($stateParams.return_url || '/');
			});
	};
}

angular
	.module('app')
	.controller('RegistrationController', RegistrationController);
