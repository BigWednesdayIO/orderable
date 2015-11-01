function BrowserStorageService ($window) {
	var service = {};

	service.getItem = function(key) {
		var data = localStorage.getItem(key);

		if (!data) {
			return data;
		}

		return JSON.parse(data);
	};

	service.setItem = function(key, data) {
		var value = JSON.stringify(data);

		return localStorage.setItem(key, value);
	};

	service.removeItem = function(key) {
		return localStorage.removeItem(key);
	};

	service.clear = function() {
		return localStorage.clear();
	};

	return service;
}

angular
	.module('app')
	.factory('browserStorage', BrowserStorageService);
