function SearchService ($rootScope, $location, $http, $q, API, suppliersService, categoriesService, _) {
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
		})
			.sort()
			.join('&');
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
	};

	service.getSearchSuggestions = function(query) {
		return $http({
			url: API.search_suggestions,
			method: 'POST',
			data: {
				query: query
			}
		})
			.then(function(response) {
				return response.hits;
			});
	};

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
					suppliers = _.keys(hitsBySupplier),
					index,
					categories;

				response.hitsBySupplier = hitsBySupplier;
				response.suppliers = suppliers;

				index = _.findIndex(response.facets, {field: 'category_code'});

				if (index === -1) {
					return response;
				}

				categories = response.facets[index].values;
				return $q.all(categories.map(function(category) {
					return categoriesService
						.getNameForCategory(category.value);
				}))
					.then(function(names) {
						response.facets[index].field = 'category_hierachy';
						response.facets[index].values = categories.map(function(category, i) {
							category.display_name = names[i];
							return category;
						});
						return response;
					});
			});
	};
}

angular
	.module('app')
	.service('searchService', SearchService);
