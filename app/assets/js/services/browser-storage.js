function BrowserStorageService ($rootScope, $window) {
	var service = {},
		listeners = [];

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

	service.watch = function(key, callback) {
		if (typeof callback !== 'function') {
			return;
		}

		listeners.push({
			key: key,
			callback: callback
		});
	};

	$window.addEventListener('storage', function(e) {
		listeners.forEach(function(listener) {
			if (listener.key === e.key) {
				// Can't rely on e.newValue in IE
				listener.callback(e, service.getItem(e.key));
				$rootScope.$digest();
			};
		});
	});

	return service;
}

angular
	.module('app')
	.factory('browserStorage', BrowserStorageService);
