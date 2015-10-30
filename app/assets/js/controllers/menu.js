function MenuController ($mdSidenav, navigationService, brand) {
	var vm = this;

	vm.brand = brand

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
