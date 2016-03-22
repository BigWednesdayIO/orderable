function RegistrationController ($stateParams, $location, customerService) {
	var vm = this;

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
