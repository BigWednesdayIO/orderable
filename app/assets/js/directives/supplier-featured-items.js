function SupplierFeaturedItemsDirective ($window, $location) {
	return {
		restrict: 'EA',
		scope: {
			supplier: '=',
			hits: '=',
			buttonText: '@'
		},
		controller: function($rootScope, $scope, searchService, suppliersService) {
			function buildHref () {
				return ($location.path().match('search/') ? '' : 'search/') + searchService.applyRefinementToUrl('supplier_id', $scope.supplier);
			}

			$scope.href = buildHref();

			$rootScope.$on('$locationChangeStart', function() {
				$scope.href = buildHref();
			});

			suppliersService
				.getSupplierInfo($scope.supplier)
				.then(function(info) {
					$scope.supplierInfo = info;
				});
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
