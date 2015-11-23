function PostcodeService ($rootScope, $q, $mdDialog, browserStorage) {
	var service = this;

	service.getPostcode = function() {
		return $q.when(browserStorage.getItem('postcode'));
	};

	service.updatePostcode = function(newPostcode) {
		browserStorage.setItem('postcode', newPostcode);
		$rootScope.$emit('postcodeUpdated', newPostcode);
	};

	service.getPostcodeFromUser = function($event) {
		return $mdDialog
			.show({
				targetEvent: $event,
				templateUrl: 'views/partials/postcode-dialog.html',
				controller: 'PostcodeController',
				controllerAs: 'vm',
				escapeToClose: false
			})
			.then(function(postcode) {
				if (postcode) {
					service.updatePostcode(postcode);
				}
				return postcode;
			});
	};

	browserStorage.watch('postcode', function(e, newPostcode) {
		$rootScope.$emit('postcodeUpdated', newPostcode);
	});
}

angular
	.module('app')
	.service('postcodeService', PostcodeService);
