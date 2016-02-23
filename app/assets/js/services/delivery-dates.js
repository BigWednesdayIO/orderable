function DeliveryDatesService ($filter, suppliersService) {
	var service = this;

	var $date = $filter('date');

	service.getDatesForOrderForm = function(orderForm) {
		var dates = [
			new Date(),
			new Date(),
			new Date()
		];
		var dayOfMonth = dates[0].getDate();
		var tomorrow = (new Date()).setDate(dayOfMonth + 1);

		return suppliersService
			.getSupplierInfo(orderForm.supplier_id)
			.then(function(supplierInfo) {
				var i = supplierInfo.lead_time || 0;

				return dates.map(function(date) {
					// Now days in a row, starting tomorrow, skipping Sunday
					do {
						i++;
						date.setDate(dayOfMonth + i);
					} while(date.getDay() === 0);
					return $date(date, 'yyyy-MM-dd');
				}).map(function(date) {
					var deliveryCharge = supplierInfo.delivery_charge || 0;

					return {
						date: date,
						windows: [
							{
								date: date,
								start: date + 'T08:00:00',
								end: date + 'T22:00:00',
								price: deliveryCharge,
								available: true
							}, {
								date: date,
								start: date + 'T08:00:00',
								end: date + 'T13:00:00',
								price: deliveryCharge,
								available: true
							}, {
								date: date,
								start: date + 'T13:00:00',
								end: date + 'T17:00:00',
								price: deliveryCharge,
								available: true
							}, {
								date: date,
								start: date + 'T17:00:00',
								end: date + 'T22:00:00',
								price: deliveryCharge,
								available: true
							}
						]
					};
				}).map(function(delivery) {
					var isTomorrow = $date(delivery.date, 'yyyy MM dd') === $date(tomorrow, 'yyyy MM dd');

					delivery.display_name = isTomorrow ? 'Tomorrow' : $date(delivery.date, 'EEE, MMM d');

					delivery.windows = delivery.windows.map(function(deliveryWindow, index) {
						var startTime = $date(deliveryWindow.start, 'h'),
							startPeriod = $date(deliveryWindow.start, 'a'),
							endTime = $date(deliveryWindow.end, 'h'),
							endPreiod = $date(deliveryWindow.end, 'a');

						if (startPeriod !== endPreiod) {
							startTime += ' ' + startPeriod;
						}

						endTime += ' ' + endPreiod;

						deliveryWindow.display_name = startTime + ' - ' + endTime;
						deliveryWindow.date_display_name = delivery.display_name;

						return deliveryWindow;
					});

					return delivery;
				});
			});
	};
}

angular
	.module('app')
	.service('deliveryDatesService', DeliveryDatesService);
