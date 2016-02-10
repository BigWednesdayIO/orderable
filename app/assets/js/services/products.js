function ProductsService ($http, $q, $mdToast, API) {
	var service = this;

	service.getProductById = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id
		})
			.catch(function(error) {
				$mdToast.show(
					$mdToast.simple()
						.content(error.message)
						.hideDelay(3000)
				);
				return $q.reject(error);
			});
	};

	service.getProductArray = function(ids) {
		return $http({
			method: 'GET',
			url: API.products,
			params: {
				id: ids
			}
		});
	};
}

angular
	.module('app')
	.service('productsService', ProductsService);
