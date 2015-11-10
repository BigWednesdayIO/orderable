function StateChangeHandler ($rootScope, $mdSidenav) {
	$rootScope.$on('$locationChangeSuccess', function() {
		$mdSidenav('menu')
			.close();
	});
}

angular
	.module('app')
	.run(StateChangeHandler);