function DeliveryNoteController ($mdDialog, $q, deliveryNote, supplierName) {
	var vm = this;

	vm.deliveryNote = deliveryNote;

	vm.supplierName = supplierName;

	vm.cancel = function() {
		$mdDialog
			.hide($q.reject());
	};

	vm.save = function(e) {
		if (e) {
			e.preventDefault();
		}

		$mdDialog
			.hide(vm.deliveryNote);
	};
}

angular
	.module('app')
	.controller('DeliveryNoteController', DeliveryNoteController);
