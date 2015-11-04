function CategoriesService ($http, $q, API) {
	var service = this;

	function getIdsFromChain (idChain) {
		return idChain.split('.');
	}

	service.getCategoryNames = function() {
		return $http({
			url: API.categories,
			method: 'GET',
			cache: true
		})
			.then(function(categories) {
				return _.mapValues(categories, function(category) {
					return category.name;
				});
			});
	};

	service.getNameForCategory = function(idChain) {
		var ids = getIdsFromChain(idChain),
			id = ids[ids.length - 1];

		return service
			.getCategoryNames()
			.then(function(categories) {
				return categories[id];
			});
	};

	service.getHierarchyForCategory = function(idChain) {
		var ids = getIdsFromChain(idChain);

		var namePromises = ids.map(function(id) {
			return service
				.getNameForCategory(id);
		});

		return $q.all(namePromises)
			.then(function(names) {
				return names.map(function(name, index) {
					return {
						id: ids.slice(0, index + 1).join('.'),
						name: name
					};
				});
			});
	};
}

angular
	.module('app')
	.service('categoriesService', CategoriesService);
