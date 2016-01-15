function MenuController ($rootScope, $state, $mdSidenav, navigationService, suppliersService, customerService, menuColours, brand) {
	var vm = this;

	function syncPins (updatedPins) {
		vm.isPinned = updatedPins.reduce(function(pinned, supplier) {
			pinned[supplier.id] = supplier;
			return pinned;
		}, {});
		vm.hasPins = updatedPins.length > 0;
	}

	vm.brand = brand;

	vm.menuColours = menuColours;

	vm.toggleMenu = function() {
		$mdSidenav('menu')
			.toggle();
	};

	vm.suppliers = suppliersService.getCurrentSuppliers();

	vm.getUrlForSupplier = function(supplier) {
		return 'search/?supplier_id=' + encodeURIComponent(supplier);
	};

	vm.getBrandImageForSupplier = suppliersService.getBrandImageForSupplier;

	vm.getLogoForSupplier = suppliersService.getLogoForSupplier;

	suppliersService
		.getPinnedSuppliers()
		.then(syncPins);

	vm.pinSupplier = function(supplier) {
		suppliersService
			.togglePinnedSupplier(supplier)
			.then(syncPins);
	}

	vm.isSignedIn = customerService.isSignedIn();

	vm.signOut = function() {
		customerService
			.signOut()
			.then(function() {
				vm.isSignedIn = false;
				$state.go('home');
			});
	};

	$rootScope.$on('userSignIn', function() {
		vm.isSignedIn = true;
	});

	navigationService
		.getNavigation()
		.then(function(navigation) {
			vm.categories = navigation;
		});

	$rootScope.$on('suppliersUpdated', function(e, suppliers) {
		vm.suppliers = suppliers;
	});
}

angular
	.module('app')
	.controller('MenuController', MenuController);
