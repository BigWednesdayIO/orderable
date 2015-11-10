angular
	.module('app')
	.constant('sortOptions', [
		{
			display_name: 'Sort: Relevance',
			value: 'relevance'
		}, {
			display_name: 'Sort: Price low to high',
			value: 'price.asc'
		}, {
			display_name: 'Sort: Price high to low',
			value: 'price.desc'
		}
	]);
