function APIConstant () {
	var API = {};

	API.base = '/api/';
	API.search = API.base + 'v1/search';

	return API;
}

angular
	.module('app')
	.constant('API', APIConstant());
