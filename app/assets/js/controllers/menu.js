function MenuController ($mdSidenav, navigationService) {
	var vm = this;

	vm.toggleMenu = function() {
		$mdSidenav('menu')
			.toggle();
	}

	navigationService
		.getNavigation()
		.then(function(navigation) {
			vm.categories = navigation;
		});
}

angular
	.module('app')
	.controller('MenuController', MenuController);
