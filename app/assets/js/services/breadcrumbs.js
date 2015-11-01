function BreadcrumbsService ($location, $q, searchService, _) {
	var service = this;

	function getCategories (search) {
		return [
			{
				name: 'bar',
				href: '/search/bar/',
				params: search
			}, {
				name: 'baz',
				href: '/search/bar/baz/',
				params: search
			}
		]
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

		breadcrumbs = breadcrumbs.concat(getCategories(search));

		breadcrumbs = breadcrumbs.map(function(crumb) {
			if (crumb.params) {
				crumb.href += searchService.buildQueryString(crumb.params);
			}

			return crumb;
		});

		return $q.when(breadcrumbs);
	}
}

angular
	.module('app')
	.service('breadcrumbsService', BreadcrumbsService);
