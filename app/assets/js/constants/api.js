function APIConstant () {
	var API = {};

	API.base = '/api/';
	API.search = API.base + 'v1/search';

	API.navigation = '/mocks/navigation.json';

	API.search = 'https://api.bigwednesday.io/1/search/indexes/crateful-products/query';

	return API;
}

angular
	.module('app')
	.constant('API', APIConstant());
