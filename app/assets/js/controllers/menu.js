function MenuController ($mdSidenav, $timeout, eventWrapper, navigationService, suppliersService, menuColours, brand) {
	var vm = this,
		closeTimer;

	function closeListener (event) {
		if (event.target.closest('.suppliers-dropdown')) {
			return;
		}
		vm.hideSuppliers(0);
	}

	vm.brand = brand;

	vm.menuColours = menuColours;

	vm.toggleMenu = function() {
		$mdSidenav('menu')
			.toggle();
	}

	vm.suppliers = suppliersService.getCurrentSuppliers();

	vm.getUrlForSupplier = function(supplier) {
		return 'search/?supplier=' + encodeURIComponent(supplier);
	}

	vm.getBrandImageForSupplier = suppliersService.getBrandImageForSupplier;

	vm.toggleShowSuppliers = function() {
		vm.suppliersAreShown ? vm.hideSuppliers(0) : vm.showSuppliers();
	};

	vm.hideSuppliers = function(delay) {
		closeTimer = $timeout(function() {
			vm.suppliersAreShown = false;
			eventWrapper.removeEventListener('click', closeListener);
		}, delay);
	};

	vm.showSuppliers = function() {
		$timeout.cancel(closeTimer);
		vm.suppliersAreShown = true;
		eventWrapper.addEventListener('click', closeListener, false);
	};

	navigationService
		.getNavigation()
		.then(function(navigation) {
			vm.categories = navigation;
		});
}

angular
	.module('app')
	.controller('MenuController', MenuController);
