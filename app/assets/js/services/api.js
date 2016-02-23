function APIService (baseAPI) {
	this.navigation = 'mocks/navigation.json';

	this.products = baseAPI + 'indexes/orderable-products';
	this.search = this.products + '/query';
	this.search_suggestions = baseAPI + 'indexes/crateful-suggestions/query';

	this.product_images = baseAPI + '/images/dc3gcqic2/image/upload/';

	this.checkouts = baseAPI + 'checkouts'

	this.categories = 'https://raw.githubusercontent.com/BigWednesdayIO/categories-api/master/categories.json';

	this.customers = baseAPI + 'customers';

	this.suppliers = baseAPI + 'suppliers';

	this.orders = baseAPI + 'orders';

	this.addressLookup = 'https://api.getAddress.io/v2/uk';
}

angular
	.module('app')
	.service('API', APIService);
