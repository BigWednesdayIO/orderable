function WishlistService ($q, browserStorage) {
	var service = this;

	service.getWishlist = function() {
		return $q.when(browserStorage.getItem('wishlist') || []);
	};

	service.saveForLater = function(product) {
		return service
			.getWishlist()
			.then(function(wishlist) {
				wishlist.unshift(product);
				wishlist = _.uniq(wishlist, 'id');
				browserStorage.setItem('wishlist', wishlist);
				return $q.when(wishlist);
			});
	};

	service.remove = function(product) {
		return service
			.getWishlist()
			.then(function(wishlist) {
				wishlist = _.reject(wishlist, {id: product.id});
				browserStorage.setItem('wishlist', wishlist);
				return $q.when(wishlist);
			});
	};
}

angular
	.module('app')
	.service('wishlistService', WishlistService);
