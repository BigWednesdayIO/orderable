function BreadcrumbsService ($location, $q, _) {
	var service = this;

	function getCategories () {
		return [
			{
				name: 'bar',
				href: '/search/bar/'
			}, {
				name: 'baz',
				href: '/search/bar/baz/'
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
			params = angular.copy(breadcrumbs[breadcrumbs.length - 1].params);
			params.supplier = supplier;

			breadcrumbs.push({
				name: supplier,
				href: '/search/',
				params: params
			})
		}

		categories = getCategories();

		if (query && categories) {
			categories = categories.map(function(category) {
				category.params = angular.copy(breadcrumbs[breadcrumbs.length - 1].params);
				return category;
			});
		}

		breadcrumbs = breadcrumbs.concat(categories);

		breadcrumbs = breadcrumbs.map(function(crumb) {
			if (crumb.params) {
				crumb.href += '?' + _.map(crumb.params, function(value, key) {
					return key + '=' + value;
				}).join('&');
			}

			return crumb;
		});

		return $q.when(breadcrumbs);
	}
}

angular
	.module('app')
	.service('breadcrumbsService', BreadcrumbsService);
