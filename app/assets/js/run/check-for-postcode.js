function checkForPostcode ($state, postcodeService, suppliersService) {
	postcodeService
		.getPostcode()
		.then(function(postcode) {
			if (postcode && postcode !== '' && suppliersService.getCurrentSuppliers().length) {
				return;
			}

			$state.go('home');

			return postcodeService
				.getPostcodeFromUser();
		});
}

angular
	.module('app')
	.run(checkForPostcode);
