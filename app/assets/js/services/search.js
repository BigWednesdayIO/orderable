function SearchService ($rootScope, $location, $http, $q, API, suppliersService, categoriesService, _) {
	var service = this;

	var path = $location.path().slice(1),
		search = $location.search();

	$rootScope.$on('$locationChangeStart', function() {
		path = $location.path().slice(1);
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
		var params = angular.copy(search),
			ids;
		if (key === 'category_hierarchy' && (params[key] || '').indexOf('.') > -1) {
			ids = params[key].split('.');
			// Removes last part of chain
			params[key] = ids.slice(0, ids.length - 1).join('.');
		} else {
			delete params[key];
		}
		return path + service.buildQueryString(params);
	};

	service.getFiltersFromUrl = function() {
		var reservedWords = ['query', 'sort'];

		return _.map(search, function(value, key) {
			return {
				field: key,
				term: value
			};
		}).filter(function(filter) {
			return reservedWords.indexOf(filter.field) === -1;
		});
	};

	service.getSortOptionFromUrl = function() {
		var sort = search.sort;

		if (!sort || sort === 'relevance') {
			return;
		}

		sort = sort.split('.');

		return [{
			field: sort[0],
			direction: sort[1]
		}];
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
		var filters = params.filters || [],
			index = _.findIndex(filters, {field: 'supplier'});

		if (index === -1) {
			filters.push({
				field: 'supplier',
				terms: suppliersService.getCurrentSuppliers()
			});
			params.filters = filters;
		}

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
					categories,
					chosenCategory;

				response.hitsBySupplier = hitsBySupplier;
				response.suppliers = suppliers;

				index = _.findIndex(response.facets, {field: 'category_code'});

				if (index === -1) {
					return response;
				}

				categories = response.facets[index].values;

				chosenCategory = _.find(params.filters, {field: 'category_hierarchy'});
				if (chosenCategory) {
					categories.unshift({
						value: chosenCategory.term
					});
					categories = _.uniq(categories, 'value');
				}

				return $q.all(categories.map(function(category) {
					return categoriesService
						.getNameForCategory(category.value);
				}))
					.then(function(names) {
						response.facets[index].field = 'category_hierarchy';
						response.facets[index].display_name = 'Category';
						response.facets[index].values = categories.map(function(category, i) {
							category.display_name = names[i];
							return category;
						});
						return response;
					});
			});
	};

	service.getSuppliersForCategory = function(category) {
		var params = {
			filters: [
				{
					field: 'category_hierarchy',
					term: category
				}, {
					field: 'supplier',
					terms: suppliersService.getCurrentSuppliers()
				}
			],
			hitsPerPage: 0
		};

		return $http({
			url: API.search,
			method: 'POST',
			data: params
		})
			.then(function(response) {
				var suppliers = (_.find(response.facets, {field: 'supplier'}) || {}).values;

				return suppliers.map(function(supplier) {
					return {
						name: supplier.value,
						image: suppliersService.getBrandImageForSupplier(supplier.value),
						href: 'search/?supplier=' + encodeURIComponent(supplier.value) + '&category_hierarchy=' + category
					};
				});
			});
	}
}

angular
	.module('app')
	.service('searchService', SearchService);
