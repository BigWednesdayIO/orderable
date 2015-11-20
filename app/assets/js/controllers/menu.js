function MenuController ($mdSidenav, $timeout, eventWrapper, navigationService, suppliersService, menuColours, brand) {
	var vm = this;

	vm.brand = brand;

	vm.menuColours = menuColours;

	vm.toggleMenu = function() {
		$mdSidenav('menu')
			.toggle();
	}

	vm.suppliers = suppliersService.getCurrentSuppliers();

	vm.getUrlForSupplier = function(supplier) {
		return 'search/?supplier=' + encodeURIComponent(supplier);
	};

	vm.getBrandImageForSupplier = suppliersService.getBrandImageForSupplier;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	navigationService
		.getNavigation()
		.then(function(navigation) {
			vm.categories = navigation;
		});
}

angular
	.module('app')
	.controller('MenuController', MenuController);
