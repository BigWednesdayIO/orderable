function SupplierFeaturedItemsDirective ($window) {
	return {
		restrict: 'EA',
		scope: {
			supplier: '=',
			hits: '=',
			buttonText: '@'
		},
		controller: function($scope, searchService, suppliersService) {
			$scope.href = searchService.applyRefinementToUrl('supplier', $scope.supplier);

			$scope.logo = suppliersService.getLogoForSupplier($scope.supplier);
		},
		templateUrl: 'views/partials/supplier-featured-items.html',
		replace: true,
		link: function(scope, element) {
			var viewport = element[0].querySelector('#viewport'),
				thumbWidth = 212,
				container = viewport.querySelector('#items'),
				containerWidth = thumbWidth * scope.hits.length,
				offset = 0,
				viewportWidth,
				visibleThumbs;

			function calculateWidths () {
				viewportWidth = viewport.offsetWidth;
				visibleThumbs = Math.floor(viewportWidth / thumbWidth)
			}

			function slide () {
				container.style.transform = 'translate(' + offset + 'px, 0)';
				scope.farLeft = offset === 0;
				scope.farRight = containerWidth + offset <= viewportWidth;
			}

			scope.slideRight = function($event) {
				var newOffset;
				$event.preventDefault();
				newOffset = offset - (visibleThumbs * thumbWidth);
				if (newOffset * -1 >= containerWidth) {
					return;
				}
				offset = newOffset;
				slide();
			};

			scope.slideLeft = function($event) {
				var newOffset;
				$event.preventDefault();
				newOffset = offset + (visibleThumbs * thumbWidth);
				offset = (newOffset > 0) ? 0 : newOffset;
				slide();
			};

			$window.addEventListener('resize', calculateWidths);
			scope.$on('$destroy', function() {
				$window.removeEventListener('resize', calculateWidths);
			})

			// Setting it up at 0
			calculateWidths();
			slide();
		}
	};
}

angular
	.module('app')
	.directive('supplierFeaturedItems', SupplierFeaturedItemsDirective);
