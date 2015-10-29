function BrowserStorageService ($window) {
	return $window.localStorage;
}

angular
	.module('app')
	.factory('browserStorage', BrowserStorageService);
