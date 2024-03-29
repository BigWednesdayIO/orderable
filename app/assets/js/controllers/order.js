function OrderController ($q, ordersService, orderDetails, supplierInfo) {
	var vm = this;

	function checkRemainingDeliveries () {
		var outstanding = vm.order.basket.order_forms.filter(function(order_form) {
			return order_form.status !== 'delivered';
		});

		vm.outstandingDeliveries = outstanding.length > 0;
	}

	vm.order = orderDetails;

	vm.supplierInfo = supplierInfo;

	vm.markAsDelivered = function(orderForm) {
		return ordersService
			.updateOrderFormStatus(orderDetails.id, orderForm.id, 'delivered')
			.then(function(updatedOrderForm) {
				orderForm.status = updatedOrderForm.status;
				checkRemainingDeliveries();
			});
	};

	vm.markAllAsDelivered = function() {
		ordersService
			.updateWholeOrderStatus(vm.order, 'delivered')
			.then(function() {
				vm.order.basket.order_forms = vm.order.basket.order_forms.map(function(orderForm) {
					orderForm.status = 'delivered';
					return orderForm;
				});
				vm.outstandingDeliveries = false;
			})
	};

	checkRemainingDeliveries();
}

OrderController.resolve = /* @ngInject */ {
	orderDetails: function($stateParams, ordersService) {
		return ordersService
			.getOrder($stateParams.id);
	},
	supplierInfo: function($q, orderDetails, suppliersService) {
		return $q.all(orderDetails.basket.order_forms.map(function(order_form) {
			return suppliersService
				.getSupplierInfo(order_form.supplier_id);
		}))
			.then(function(suppliers) {
				return suppliers.reduce(function(map, supplier) {
					map[supplier.id] = supplier;
					return map;
				}, {});
			});
	},
	requiresSignIn: function(authorizationService) {
		return authorizationService
			.requireSignIn();
	}
};

angular
	.module('app')
	.controller('OrderController', OrderController);
