function DisableClickHijack ($mdGestureProvider) {
	$mdGestureProvider.skipClickHijack();
}

angular
	.module('app')
	.config(DisableClickHijack);
