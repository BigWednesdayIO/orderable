function checkForPostcode ($state, postcodeService) {
	postcodeService
		.getPostcode()
		.then(function(postcode) {
			if (postcode && postcode !== '') {
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
