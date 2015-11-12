function DeliveryDatesService ($q, $filter) {
	var service = this;

	var $date = $filter('date');

	service.getDatesForOrderForm = function(order_form) {
		var dates = [
				new Date(),
				new Date(),
				new Date()
			],
			now = dates[0],
			dayOfMonth = now.getDay();

		dates = dates.map(function(date, i) {
			// Now days in a row, starting today
			date.setDate(dayOfMonth + i);
			return $date(date, 'yyyy-MM-dd');
		}).map(function(date, i) {
			return {
				date: date,
				windows: [
					{
						date: date,
						start: date + 'T08:00:00',
						end: date + 'T22:00:00',
						price: 7.99,
						available: true
					}, {
						date: date,
						start: date + 'T08:00:00',
						end: date + 'T13:00:00',
						price: 7.99,
						available: !!i
					}, {
						date: date,
						start: date + 'T13:00:00',
						end: date + 'T17:00:00',
						price: 7.99,
						available: true
					}, {
						date: date,
						start: date + 'T17:00:00',
						end: date + 'T22:00:00',
						price: 7.99,
						available: true
					}
				]
			};
		}).map(function(delivery) {
			var isToday = $date(delivery.date, 'yyyy MM dd') === $date(now, 'yyyy MM dd');

			delivery.display_name = isToday ? 'Today' : $date(delivery.date, 'EEE, MMM d');

			delivery.windows = delivery.windows.map(function(deliveryWindow, index) {
				var startTime = $date(deliveryWindow.start, 'h'),
					startPeriod = $date(deliveryWindow.start, 'a'),
					endTime = $date(deliveryWindow.end, 'h'),
					endPreiod = $date(deliveryWindow.end, 'a');

				if (startPeriod !== endPreiod) {
					startTime += ' ' + startPeriod;
				}

				endTime += ' ' + endPreiod;

				deliveryWindow.display_name = '';

				if (index === 0 && now > new Date(deliveryWindow.start)) {
					deliveryWindow.display_name += 'before';
				} else {
					deliveryWindow.display_name += startTime + ' -';
				}

				deliveryWindow.display_name += ' ' + endTime;
				deliveryWindow.date_display_name = delivery.display_name;

				return deliveryWindow;
			});

			return delivery;
		});

		return $q.when(dates);
	};
}

angular
	.module('app')
	.service('deliveryDatesService', DeliveryDatesService);
