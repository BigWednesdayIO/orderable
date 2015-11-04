function iOSTouchOptimisation (FastClick) {
	if (navigator.userAgent.match(/(iPhone|iPod|iPad)/i)) {
		FastClick.attach(document.body);
		document.getElementById('viewport').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
	}
}

angular
	.module('app')
	.run(iOSTouchOptimisation);
