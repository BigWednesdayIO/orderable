function DigestHud (digestHudProvider) {
	digestHudProvider.enable();
}

angular
	.module('app')
	.config(DigestHud);
