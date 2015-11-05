function BreadcrumbsService ($location, $q, searchService, categoriesService, _) {
	var service = this;

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
			breadcrumbs, params, query, supplier, categories;

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

		supplier = search.supplier;

		if (supplier) {
			params = angular.copy(breadcrumbs[breadcrumbs.length - 1].params || {});
			params.supplier = supplier;

			breadcrumbs.push({
				name: supplier,
				href: '/search/',
				params: params
			})
		}

		breadcrumbs = breadcrumbs.concat();

		return getCategories(search)
			.then(function(categories) {
				return breadcrumbs
					.concat(categories)
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
