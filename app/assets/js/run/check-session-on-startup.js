function CheckSessionOnStartup (customerService) {
	if (!customerService.isSignedIn()) {
		return;
	}

	customerService
		.getInfo()
		.catch(function() {
			customerService.signOut();
		});
}

angular
	.module('app')
	.run(CheckSessionOnStartup);
