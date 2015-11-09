function APIConstant () {
	var API = {};

	API.base = 'https://api.bigwednesday.io/1/';
	API.base = 'https://nzgrud6b.bigwednesday.io/1/';

	API.navigation = 'mocks/navigation.json';

	API.products = API.base + 'indexes/crateful-products';
	API.search = API.products + '/query';
	API.search_suggestions = API.base + 'indexes/crateful-suggestions/query'

	API.categories = 'https://raw.githubusercontent.com/BigWednesdayIO/categories-api/master/categories.json';

	return API;
}

angular
	.module('app')
	.constant('API', APIConstant());
