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
				var hits_by_supplier = _.groupBy(response.hits, 'supplier'),
					suppliers = _.keys(hits_by_supplier);
				if (suppliers.length > 1) {
					response.hits_by_supplier = hits_by_supplier;
					response.suppliers = suppliers;
				}

				return response;
			});
	};
}

angular
	.module('app')
	.service('searchService', SearchService);
