function APIService (baseAPI) {
	this.navigation = 'mocks/navigation.json';

	this.products = baseAPI + 'indexes/orderable-products';
	this.search = this.products + '/query';
	this.search_suggestions = baseAPI + 'indexes/crateful-suggestions/query'

	this.checkouts = baseAPI + 'checkouts'

	this.categories = 'https://raw.githubusercontent.com/BigWednesdayIO/categories-api/master/categories.json';

	this.customers = baseAPI + 'customers';

	this.suppliers = baseAPI + 'suppliers';
}

angular
	.module('app')
	.service('API', APIService);
