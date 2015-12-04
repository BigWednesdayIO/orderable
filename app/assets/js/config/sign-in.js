function SignInController (customerService) {
	var vm = this;

	vm.signIn = function($event) {
		$event.preventDefault();

		customerService
			.signIn(vm.credentials);
	};
}

angular
	.module('app')
	.controller('SignInController', SignInController);
