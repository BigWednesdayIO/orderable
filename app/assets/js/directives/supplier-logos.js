function SupplierLogosDirective ($window, $interval, $timeout, $mdMedia) {
	return {
		restrict: 'EA',
		scope: {
			suppliers: '='
		},
		link: function(scope, element) {
			scope.$mdMedia = $mdMedia;
			scope.gtSm = $mdMedia('gt-sm');

			var raw = element[0];
			var logos = raw.querySelector('.supplier-logos__wrap');
			var logoList = [];
			var rowHeight = 0;
			var logosPerRow = 0;
			var lastMovedIndex = -1;
			var order = 0;
			var hasResized = false;
			var openHeight;

			function getLogoList () {
				return logoList.length ? logoList : logos.querySelectorAll('.supplier-logos__logo');
			}

			function showFirstSet () {
				var firstSet = logos.querySelectorAll('.first-set');
				Array.prototype.forEach.call(firstSet, function(logo) {
					logo.classList.remove('first-set');
				});

				logoList = getLogoList();
				if (!logoList.length) {
					return;
				}

				var indexToShow = lastMovedIndex;
				for (var i = 0; i < scope.suppliers.length; i++) {
					indexToShow++;
					if (indexToShow >= logoList.length) {
						indexToShow = 0;
					}
					logoList[indexToShow].classList.add('first-set');
				}
			}

			function calculateSizes () {
				logoList = getLogoList();
				if (!logoList.length) {
					return;
				}

				var singleLogo = logoList[0] ;

				var height = singleLogo.offsetHeight;
				var offsetTop = singleLogo.offsetTop;
				rowHeight = height ? height + (2 * offsetTop) : 0;

				var containerWidth = logos.offsetWidth;
				var logoMargin = parseInt($window.getComputedStyle(singleLogo).marginLeft, 10) * 2;
				var logoWidth = singleLogo.offsetWidth;
				logosPerRow = Math.floor(containerWidth / (logoWidth + logoMargin));

				// openHeight = Math.ceil(scope.suppliers.length / logosPerRow) * rowHeight;
			}

			function slide () {
				var offset = rowHeight * -1;
				logos.classList.remove('transition-off');
				logos.style.transform = 'translate(0, ' + offset + 'px)';

				$timeout(function() {
					// TODO consider transition end event
					logos.classList.add('transition-off');
					logos.style.transform = 'translate(0, 0)';
					order++;
					for (var i = 0; i < logosPerRow; i++) {
						lastMovedIndex++;
						if (lastMovedIndex >= logoList.length) {
							lastMovedIndex = 0;
							order++;
						}
						logoList[lastMovedIndex].style.order = order;;
					}
				}, 600);
			}

			function play () {
				if (!rowHeight || hasResized) {
					calculateSizes();
					hasResized = false;
				}
				slide();
			}

			function triggerResize () {
				hasResized = true;
			}

			var ticking = $interval(play, 4000);

			scope.toggleOpen = function() {
				scope.isOpen = !scope.isOpen;
				if (scope.isOpen) {
					$interval.cancel(ticking);
					showFirstSet();
				} else {
					ticking = $interval(play, 4000);
				}
				// if (!openHeight) {
				// 	calculateSizes();
				// }
				// raw.style.height = scope.isOpen ? openHeight + 'px' : '';
			};

			$window.onresize = triggerResize;
			scope.$watch('gtSm', triggerResize);
		},
		templateUrl: 'views/partials/supplier-logos.html',
		replace: true
	};
}

angular
	.module('app')
	.directive('supplierLogos', SupplierLogosDirective);
