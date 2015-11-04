function APIConstant () {
	var API = {};

	API.base = '/api/';
	API.search = API.base + 'v1/search';

	API.navigation = '/mocks/navigation.json';

	API.search_base = 'https://api.bigwednesday.io/1/search/indexes/';
	API.search = API.search_base + 'crateful-products/query';
	API.search_suggestions = API.search_base + 'crateful-suggestions/query'

	API.categories = 'https://raw.githubusercontent.com/BigWednesdayIO/categories-api/master/categories.json';

	return API;
}

angular
	.module('app')
	.constant('API', APIConstant());
