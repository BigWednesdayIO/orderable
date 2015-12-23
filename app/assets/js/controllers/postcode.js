function PostcodeController ($rootScope, $state, $stateParams, $timeout, $location, $mdDialog, postcodeService, suppliersService, brand) {
	var vm = this;

	vm.brand = brand;

	postcodeService
		.getPostcode()
		.then(function(postcode) {
			vm.postcode = postcode;
		});

	$rootScope.$on('postcodeUpdated', function(e, postcode) {
		vm.postcode = postcode;
	});

	vm.togglePostcodeForm = function() {
		vm.showPostcodeForm = !vm.showPostcodeForm;
		if (!vm.showPostcodeForm) {
			vm.resetForm();
		}
	}

	vm.choosePostcode = function() {
		suppliersService
			.getSuppliersForPostcode(vm.newPostcode)
			.then(function(suppliers) {
				if (!suppliers.length) {
					vm.unavailable = true;
					return;
				}
				suppliersService
					.saveSuppliers(suppliers);
				postcodeService
					.updatePostcode(vm.newPostcode);
				vm.available = true;
			});
	};

	vm.startShopping = function() {
		$timeout(function() {
			vm.showPostcodeForm = false;
			vm.resetForm();

			$mdDialog
				.hide(vm.newPostcode);

			$state.go($state.current.name, $stateParams, {
				reload: true
			});
		}, 200)
	};

	vm.resetForm = function() {
		vm.available = false;
		vm.unavailable = false;
		vm.newPostcode = '';
		vm.postcodeForm.$setPristine();
		vm.postcodeForm.$setUntouched();
	};

	vm.locationAlert = function() {

	};
}

angular
	.module('app')
	.controller('PostcodeController', PostcodeController);
