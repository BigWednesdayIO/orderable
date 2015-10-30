function PostcodeService ($rootScope, $q, $mdDialog, browserStorage) {
	var service = this;

	service.getPostcode = function() {
		return $q.when(browserStorage.getItem('postcode'));
	};

	service.updatePostcode = function(newPostcode) {
		browserStorage.setItem('postcode', newPostcode);
		$rootScope.$emit('postcodeUpdated');
	};

	service.getPostcodeFromUser = function($event) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/postcode-form.html',
				controller: 'PostcodeController',
				controllerAs: 'vm'
			})
			.then(function(postcode) {
				if (postcode) {
					service.updatePostcode(postcode);
				}
				return postcode;
			});
	};
}

angular
	.module('app')
	.service('postcodeService', PostcodeService);
