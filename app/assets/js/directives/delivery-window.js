function DeliveryWindowDirective ($document) {
	return {
		restrict: 'EA',
		scope: {
			orderForm: '=',
			deliveryDates: '='
		},
		link: function(scope, element) {
			function closeDeliveryWindow (e) {
				if (!element[0].contains(e.target)) {
					scope.closeOptions();
					scope.$digest();
				}
			}

			$document.on('click', closeDeliveryWindow);
			scope.$on('$destroy', function() {
				$document.off('click', closeDeliveryWindow)
			});
		},
		controller: function($scope, $timeout) {
			var vm = this;

			$scope.closeOptions = function() {
				vm.showOptions = false;
			};

			vm.orderForm.delivery_window = vm.deliveryDates[0].windows[0];

			vm.showDay = vm.deliveryDates[0].date;

			vm.changeWindow = function() {
				vm.showOptions = true;
			};

			vm.selectWindow = function(deliveryWindow) {
				vm.orderForm.delivery_window = deliveryWindow;
				$timeout(function() {
					vm.showOptions = false;
				}, 200);
			};
		},
		controllerAs: 'vm',
		bindToController: true,
		templateUrl: 'views/partials/delivery-window.html',
		replace: true
	};
}


angular
	.module('app')
	.directive('deliveryWindow', DeliveryWindowDirective);
