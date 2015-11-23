function DisabledDebugInfo ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}

angular
	.module('app')
	.config(DisabledDebugInfo);
