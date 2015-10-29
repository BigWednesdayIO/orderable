angular
	.module('app')
	.constant('sortOptions', [
		{
			display_name: 'Relevance',
			value: 'relevance'
		}, {
			display_name: 'Price: High to Low',
			value: 'price_desc'
		}, {
			display_name: 'Price: Low to High',
			value: 'price_asc'
		}
	]);
