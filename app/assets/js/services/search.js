function SearchService ($rootScope, $location, $mdToast, $http, $q, API, suppliersService, categoriesService, _) {
	var service = this;

	var path = $location.path().slice(1),
		search = $location.search();

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}

	function supplierId (supplier) {
		return supplier.id;
	}

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
			})
			.catch(notifyError);
	};

	function mapCategories (categories, params) {
		var chosenCategory = _.find(params.filters, {field: 'category_hierarchy'});
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
				return {
					field: 'category_hierarchy',
					display_name: 'Category',
					values: categories.map(function(category, i) {
						category.display_name = names[i];
						return category;
					})
				};
			});
	}

	function mapSuppliers (suppliers) {
		return $q.all(suppliers.map(function(supplier) {
			return suppliersService
				.getNameForSupplier(supplier.value);
		}))
			.then(function(names) {
				return {
					field: 'supplier_id',
					display_name: 'Supplier',
					values: suppliers.map(function(supplier, i) {
						supplier.display_name = names[i];
						return supplier;
					})
				}
			});
	}

	service.getResults = function(params) {
		var filters = params.filters || [],
			index = _.findIndex(filters, {field: 'supplier_id'});

		if (index === -1) {
			filters.push({
				field: 'supplier_id',
				terms: suppliersService.getCurrentSuppliers().map(supplierId)
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
				var hitsBySupplier = _.groupBy(response.hits, 'supplier_id');
				var suppliers = _.keys(hitsBySupplier);
				var categoryIndex = _.findIndex(response.facets, {field: 'category_path'});
				var supplierIndex = _.findIndex(response.facets, {field: 'supplier_id'});

				response.hitsBySupplier = hitsBySupplier;
				response.suppliers = suppliers;

				return $q.all({
					categories: mapCategories(response.facets[categoryIndex].values, params),
					suppliers: mapSuppliers(response.facets[supplierIndex].values)
				})
					.then(function(mapping) {
						response.facets[categoryIndex] = mapping.categories;
						response.facets[supplierIndex] = mapping.suppliers;
						return response;
					});
			})
			.catch(notifyError);
	};

	service.getSuppliersForCategory = function(category) {
		var params = {
			filters: [
				{
					field: 'category_hierarchy',
					term: category
				}, {
					field: 'supplier_id',
					terms: suppliersService.getCurrentSuppliers().map(supplierId)
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
				var suppliers = (_.find(response.facets, {field: 'supplier_id'}) || {}).values;

				return suppliers.map(function(supplier) {
					return {
						name: supplier.value,
						image: suppliersService.getBrandImageForSupplier(supplier.value),
						href: 'search/' + service.buildQueryString({
							supplier_id: supplier.value,
							category_hierarchy: category
						})
					};
				});
			})
			.catch(notifyError);
	}
}

angular
	.module('app')
	.service('searchService', SearchService);
