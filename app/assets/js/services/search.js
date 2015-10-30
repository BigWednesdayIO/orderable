function SearchService ($http, $q, API, _) {
	var service = this;

	service.getResults = function(params) {
		if (!params.hitsPerPage) {
			params.hitsPerPage = 20;
		}

		return $http({
			url: API.search,
			method: 'POST',
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			},
			data: params
		})
			.then(function(response) {
				var suppliers = _.groupBy(response.hits, 'supplier');
				if (_.keys(suppliers).length > 1) {
					response.suppliers = suppliers;
				}

				console.log(response.suppliers);
				return response;
			});
	};
}

angular
	.module('app')
	.service('searchService', SearchService);
