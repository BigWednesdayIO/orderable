function CardMaskFilter () {
	return function(string) {
		if (!string) {
			return '';
		}
		return '**** **** **** ' + string.slice(12);
	}
}

angular
	.module('app')
	.filter('cardMask', CardMaskFilter);
