function ProductsService ($http, API) {
	var service = this;

	service.getProductById = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id
		});
	};
}

angular
	.module('app')
	.service('productsService', ProductsService);
