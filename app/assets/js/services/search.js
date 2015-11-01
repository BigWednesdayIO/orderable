function SearchService ($rootScope, $location, $http, $q, API, _) {
	var service = this;

	var path = $location.path(),
		search = $location.search();

	$rootScope.$on('$locationChangeSuccess', function() {
		path = $location.path();
		search = $location.search();
	});

	service.buildQueryString = function(params) {
		return '?' + _.map(params, function(value, key) {
			return key + '=' + value;
		}).join('&');
	};

	service.applyRefinementToUrl = function(key, value) {
		var params = angular.copy(search);
		params[key] = value;
		return path + service.buildQueryString(params);
	};

	service.getResults = function(params) {
		params.hitsPerPage = params.hitsPerPage || 20;

		return $http({
			url: API.search,
			method: 'POST',
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			},
			data: params
		})
			.then(function(response) {
				var hits_by_supplier = _.groupBy(response.hits, 'supplier'),
					suppliers = _.keys(hits_by_supplier);
				if (suppliers.length > 1) {
					response.hits_by_supplier = hits_by_supplier;
					response.suppliers = suppliers;
				}

				return response;
			});
	};
}

angular
	.module('app')
	.service('searchService', SearchService);
