function MaterialDateFilter ($filter) {
	var $date = $filter('date');

	function format (date) {
		return parseInt($date(date, 'yyyyMMdd'), 10);
	}
	var today = new Date();
	var day = today.getDate();
	var dayOfWeek = today.getDay()

	var tomorrow = format((new Date()).setDate(day + 1));
	var yesterday = format((new Date()).setDate(-1));
	var endOfWeek = format((new Date()).setDate(day + (7 - dayOfWeek)));

	today = format(today);

	var matches = {};
	matches[today] = 'Today';
	matches[yesterday] = 'Yesterday';
	matches[tomorrow] = 'Tomorrow';

	return function(date) {
		date = format(date);

		return matches[date] || (function() {
			if (date > tomorrow) {
				if (date <= endOfWeek) {
					return 'This week';
				}
				return 'Later';
			}
			return 'Earlier';
		})();
	};
}

angular
	.module('app')
	.filter('materialDate', MaterialDateFilter);
