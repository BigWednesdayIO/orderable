function SignInController ($stateParams, $location, customerService) {
	var vm = this;

	if ($stateParams.return_url) {
		vm.returnUrl = encodeURIComponent($stateParams.return_url);
	}

	vm.signIn = function($event) {
		$event.preventDefault();

		customerService
			.signIn(vm.credentials)
			.then(function() {
				$location.url($stateParams.return_url || '/');
			});
	};
}

angular
	.module('app')
	.controller('SignInController', SignInController);
