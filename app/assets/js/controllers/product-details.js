function ProductDetailsController (basketService, suppliersService, productData, _) {
	var vm = this;

	function setQuantities (quantity) {
		vm.quantityInBasket = quantity;
		if (vm.quantityInBasket > 0) {
			vm.quantities = _.range(0, 10);
		} else {
			vm.quantities = _.range(1, 10)
		}
	}

	vm.product = productData;

	vm.supplierLogo = suppliersService.getLogoForSupplier(productData.supplier);

	vm.addToBasket = function() {
		basketService
			.addToBasket(vm.product, vm.quantity)
			.then(function(line_item) {
				setQuantities(line_item.quantity);
			});
	};

	vm.removeFromBasket = function() {
		basketService
			.removeFromBasket(vm.product)
			.then(function() {
				setQuantities(0);
				// Reset ready to add again
				vm.quantity = 1;
			});
	};

	vm.changeQuantity = function() {
		if (vm.quantityInBasket === 0) {
			return;
		}
		if (vm.quantity === 0) {
			return vm.removeFromBasket();
		}
		return vm.addToBasket();

	};

	basketService
		.getProductQuantity(vm.product)
		.then(function(quantity) {
			vm.quantity = quantity || 1;
			setQuantities(quantity);
		});
}

ProductDetailsController.resolve = /* @ngInject */ {
	productData: function($stateParams, productsService) {
		return productsService
			.getProductById($stateParams.id)
			.then(function(product) {
				product.id = product.objectID;
				return product;
			});
	}
};

angular
	.module('app')
	.controller('ProductDetailsController', ProductDetailsController);
