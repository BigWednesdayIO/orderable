function ProductDetailsController ($window, basketService, productAttributes, productData, supplierInfo, breadcrumbs, _) {
	var vm = this;

	function nameAndValue (val) {
		return {
			name: val + '',
			value: val
		};
	}

	function setQuantities (quantity) {
		vm.quantityInBasket = quantity;
		vm.quantities = _.range(1, 10).map(nameAndValue);
		vm.quantities.push({
			name: '10+',
			value: 10
		});
	}

	vm.product = productData;
	vm.supplier = supplierInfo;

	vm.product.thumbnail_image_url = vm.product.thumbnail_image_url || 'assets/images/placeholder.jpg';

	vm.productAttributes = productAttributes.map(function(attribute) {
		attribute.value = productData[attribute.key];
		return attribute;
	}).filter(function(attribute) {
		return typeof attribute.value !== 'undefined';
	});

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
			if (!vm.quantity) {
				vm.quantity = 1;
			}
			return;
		}
		if (vm.quantity === 0) {
			return vm.removeFromBasket();
		}
		return vm.addToBasket();

	};

	vm.breadcrumbs = breadcrumbs;

	vm.backToResults = function($event) {
		$event.preventDefault();
		$window.history.back();
	};

	basketService
		.getProductQuantity(vm.product)
		.then(function(quantity) {
			vm.quantity = quantity || 1;
			setQuantities(quantity);
		});
}

ProductDetailsController.resolve = /* @ngInject */ {
	productData: function($sce, $stateParams, productsService) {
		return productsService
			.getProductById($stateParams.id)
			.then(function(product) {
				product.id = product.objectID;
				product.description = $sce.trustAsHtml(product.description);
				return product;
			});
	},
	supplierInfo: function(productData, suppliersService) {
		return suppliersService
			.getSupplierInfo(productData.supplier_id);
	},
	breadcrumbs: function(breadcrumbsService, supplierInfo, productData) {
		return breadcrumbsService
			.getBreadcrumbs({
				supplier_id: supplierInfo.id,
				category_hierarchy: productData.category_path
			})
			.then(function(breadcrumbs) {
				breadcrumbs.push({
					name: productData.name,
					href: 'product/' + productData.id + '/'
				});
				return breadcrumbs
			});
	}
};

angular
	.module('app')
	.controller('ProductDetailsController', ProductDetailsController);
