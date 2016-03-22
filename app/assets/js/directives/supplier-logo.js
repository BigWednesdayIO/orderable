function SupplierLogoDirective () {
	return {
		restrict: 'EA',
		scope: {
			supplier: '=',
			size: '='
		},
		controller: function() {
			var vm = this;
		},
		controllerAs: 'vm',
		bindToController: true,
		template: [
			'<div ng-if="!vm.supplier.logo" class="supplier-logo supplier-logo--placeholder" style="background-color: {{ vm.supplier.colour }}; height: {{ vm.size || 80 }}px; width: {{ vm.size || 80 }}px; line-height: {{ vm.size || 80 }}px; font-size: {{ (vm.size || 80) * 0.425 }}px" ng-bind="vm.supplier.initials || vm.supplier.name.substring(0, 2)" title="{{ vm.supplier.name }}"></div>',
			'<img ng-if="vm.supplier.logo" class="supplier-logo" ng-src="{{ vm.supplier.logo }}" height="{{ vm.size || 80 }}" width="{{ vm.size || 80 }}" alt="{{ vm.supplier.name }}" title="{{ vm.supplier.name }}" />'
		].join('')
	}
};

angular
	.module('app')
	.directive('supplierLogo', SupplierLogoDirective);
