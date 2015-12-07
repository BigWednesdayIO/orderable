function AuthorizationService ($rootScope, $q, $state, $location, $mdDialog, customerService) {
	var service = {};

	function askUserToSignIn () {
		var confirm = $mdDialog.confirm()
			.title('Sign in to Orderable')
			.content('You\'ll need to sign in to continue. If you don\'t have an account yet, sign up now for free')
			.ariaLabel('Sign in to continue')
			.cancel('Cancel')
			.ok('Sign in');

		return $mdDialog
			.show(confirm);
	}

	service.stateChange = null;

	service.requireSignIn = function() {
		var deferred, caputredState, returnUrl;

		if (customerService.isSignedIn()) {
			return $q.when(customerService.getSessionInfo());
		}

		deferred = $q.defer();

		if (service.stateChange) {
			caputredState = service.stateChange;
			caputredState.event.preventDefault();
		} else {
			returnUrl = $location.url();
		}

		askUserToSignIn()
			.then(function() {
				$state.go('sign-in');
				$rootScope.$on('userSignIn', function(e, info) {
					deferred.resolve(info);
					if (caputredState) {
						$state.go(caputredState.toState, caputredState.toParams);
					} else {
						$location.url(returnUrl);
					}
				});
			}, function() {
				deferred.reject();
			});

		return deferred.promise;
	};

	return service;
}

function AuthorizationRunner ($rootScope, authorizationService) {
	function removeEventBinding () {
		authorizationService.stateChange = null;
	}

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
		authorizationService.stateChange = {
			event: event,
			toState: toState,
			toParams: toParams
		};
	});

	$rootScope.$on('$stateChangeSuccess', removeEventBinding);
	$rootScope.$on('$stateChangeError', removeEventBinding);
}

angular
	.module('app')
	.factory('authorizationService', AuthorizationService)
	.run(AuthorizationRunner);
