function BreadcrumbsService ($q) {
	var service = this;

	function getSearchQuery () {
		return 'foo';
	}

	function getCategories () {
		return [
			{
				name: 'bar',
				href: '/bar/'
			}, {
				name: 'baz',
				href: '/bar/baz/'
			}
		]
	}

	service.getBreadcrumbs = function() {
		var breadcrumbs, query, categories;

		breadcrumbs = [
			{
				name: 'Home',
				href: '/'
			}
		];

		query = getSearchQuery();

		if (query) {
			breadcrumbs.push({
				name: '"' + query + '"',
				href: '/?query=' + query
			});
		}

		categories = getCategories();

		if (query && categories) {
			categories = categories.map(function(category) {
				category.href += '?query=' + query;
				return category;
			});
		}

		breadcrumbs = breadcrumbs.concat(categories);

		return $q.when(breadcrumbs);
	}
}

angular
	.module('app')
	.service('breadcrumbsService', BreadcrumbsService);
