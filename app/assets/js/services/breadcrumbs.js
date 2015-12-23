function BreadcrumbsService ($location, $q, searchService, categoriesService, suppliersService, _) {
	var service = this;

	function getSupplier (search) {
		if (!search.supplier_id) {
			return $q.when([]);
		}

		return suppliersService
			.getNameForSupplier(search.supplier_id)
			.then(function(name) {
				var params = {
					supplier_id: search.supplier_id
				};

				if (search.query) {
					params.query = search.query;
				}

				return {
					name: name,
					href: '/search/',
					params: params
				}
			});
	}

	function getCategories (search) {
		if (!search.category_hierarchy) {
			return $q.when([]);
		}

		return categoriesService
			.getHierarchyForCategory(search.category_hierarchy)
			.then(function(categories) {
				return categories.map(function(category) {
					category.href = '/search/';
					category.params = angular.copy(search);
					category.params.category_hierarchy = category.id;
					return category;
				});
			});
	}

	service.getBreadcrumbs = function() {
		var search = $location.search(),
			breadcrumbs, params, query;

		breadcrumbs = [
			{
				name: 'Home',
				href: '/'
			}
		];

		query = search.query;

		if (query) {
			breadcrumbs.push({
				name: '"' + query + '"',
				href: '/search/',
				params: {
					query: query
				}
			});
		}

		return $q.all({
			supplier: getSupplier(search),
			categories: getCategories(search)
		})
			.then(function(response) {
				return breadcrumbs
					.concat(response.supplier)
					.concat(response.categories)
					.map(function(crumb) {
						if (crumb.params) {
							crumb.href += searchService.buildQueryString(crumb.params);
						}
						return crumb;
					});
			})
	}
}

angular
	.module('app')
	.service('breadcrumbsService', BreadcrumbsService);
