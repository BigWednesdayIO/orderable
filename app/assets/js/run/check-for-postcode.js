function checkForPostcode ($state, postcodeService) {
	postcodeService
		.getPostcode()
		.then(function(postcode) {
			if (postcode && postcode !== '' || !service.getCurrentSuppliers().length) {
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
