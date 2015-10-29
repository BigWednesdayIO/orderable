function APIConstant () {
	var API = {};

	API.base = '/api/';
	API.search = API.base + 'v1/search';

	API.navigation = '/mocks/navigation.json';

	return API;
}

angular
	.module('app')
	.constant('API', APIConstant());
