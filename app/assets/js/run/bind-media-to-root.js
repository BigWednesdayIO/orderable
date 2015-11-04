function bindMediaToRoot ($rootScope, $mdMedia) {
	$rootScope.$mdMedia = $mdMedia;
}

angular
	.module('app')
	.run(bindMediaToRoot);
