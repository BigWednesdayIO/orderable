function ProductsService ($http, $mdToast, API) {
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
}

angular
	.module('app')
	.service('productsService', ProductsService);
