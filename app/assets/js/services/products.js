function ProductsService ($http, $q, $mdToast, API) {
	var service = this;

	service.getProductById = function(id) {
		return $http({
			method: 'GET',
			url: API.products + '/' + id,
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			}
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
		if (ids.length === 1) {
			return service
				.getProductById(ids[0])
				.then(function(product) {
					return [product];
				});
		}

		return $http({
			method: 'GET',
			url: API.products,
			params: {
				id: ids
			},
			headers: {
				Authorization: 'Bearer NG0TuV~u2ni#BP|'
			}
		});
	};
}

angular
	.module('app')
	.service('productsService', ProductsService);
