angular
	.module('app', ['ngMaterial', 'ui.router']);

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

function bindMediaToRoot ($rootScope, $mdMedia) {
	$rootScope.$mdMedia = $mdMedia;
}

angular
	.module('app')
	.run(checkForPostcode)
	.run(bindMediaToRoot);
