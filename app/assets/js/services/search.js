function SearchService ($rootScope, $location, $http, $q, API, suppliersService, _) {
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
		params[key] = encodeURIComponent(value);
		return path + service.buildQueryString(params);
	};

	service.removeRefinementFromUrl = function(key) {
		var params = angular.copy(search);
		delete params[key];
		return path + service.buildQueryString(params);
	};

	service.getFiltersFromUrl = function() {
		var reservedWords = ['query'];

		return _.map($location.search(), function(value, key) {
			return {
				field: key,
				term: value
			};
		}).filter(function(filter) {
			return reservedWords.indexOf(filter.field) === -1;
		});
	}

	service.getResults = function(params) {
		// TODO enable this when supplier names are supported
		/* var filters = params.filters || [],
			index = _.findIndex(filters, {field: 'suppliers'});

		if (index === -1) {
			filters.push({
				field: 'suppliers',
				term: suppliersService.getCurrentSuppliers()
			});
			params.filters = filters;
		} */

		params.hitsPerPage = params.hitsPerPage || 20;

		return $http({
			url: API.search,
			method: 'POST',
			data: params
		})
			.then(function(response) {
				var hitsBySupplier = _.groupBy(response.hits, 'supplier'),
					suppliers = _.keys(hitsBySupplier);

				if (suppliers.length > 1) {
					response.hitsBySupplier = hitsBySupplier;
					response.suppliers = suppliers;
				}

				// TODO remove when facet values are case corrected
				response.facets = response.facets.map(function(facet) {
					facet.values = facet.values.map(function(value) {
						value.value = value.value.toLowerCase();
						return value;
					});
					return facet;
				});

				return response;
			});
	};
}

angular
	.module('app')
	.service('searchService', SearchService);
