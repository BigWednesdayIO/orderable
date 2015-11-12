function PaymentController ($mdDialog, $q, paymentInfo) {
	var vm = this;

	vm.payment = paymentInfo

	vm.cancel = function() {
		$mdDialog
			.hide($q.reject());
	};

	vm.save = function(e) {
		if (e) {
			e.preventDefault();
		}

		if (vm.paymentForm.$invalid) {
			return;
		}

		vm.payment.card_number = vm.payment.card_number.replace(/[-\s]+/g, '');

		vm.payment.expiry_year = parseInt(vm.payment.expiry_year, 10);
		vm.payment.expiry_month = parseInt(vm.payment.expiry_month, 10);

		if (vm.payment.expiry_year > 2000) {
			vm.payment.expiry_year -= 2000;
		}

		vm.payment.card_type = (function(cardNumber) {
			var cardTypes = [
				{
					name: 'Visa',
					pattern: /^4/
				}, {
					name: 'MasterCard',
					pattern: /^5[1-5]/
				}, {
					name: 'American Express',
					pattern: /^3[47]/
				}
			];

			var match = cardTypes.filter(function(cardType) {
				return cardNumber.match(cardType.pattern);
			})[0];

			return match ? match.name : 'Unknown';
		})(vm.payment.card_number);

		$mdDialog
			.hide(vm.payment);
	};
}

angular
	.module('app')
	.controller('PaymentController', PaymentController);
