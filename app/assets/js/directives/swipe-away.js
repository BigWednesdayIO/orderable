function SwipeAwayDirective ($parse, $document, $window, $timeout) {
	return {
		restrict: 'EA',
		link: function(scope, $element, attributes) {
			function onSwipe () {
				scope.$apply(function() {
					$parse(attributes.swipeAway)(scope);
				});
			}

			var element = $element[0];
			var elementStyle = element.style;
			var startingLocation = {};
			var currentLocation = {};
			var visualUpdates;
			var threshold;

			var bodyStyle = $document[0].body.style;
			var target = $element.find('[swipe-away-target]');
			target = target.length ? target : $element;

			var lockedIn;

			function setStyles () {
				bodyStyle.overflow = 'hidden';
				elementStyle.transition = 'none';
			}

			function resetStyles () {
				bodyStyle.overflow = '';
				elementStyle.transition = '';
			}

			function setOffset (x) {
				elementStyle.transform = 'translate3d(' + x + 'px, 0, 0)';
			}

			function getOffset () {
				var x = currentLocation.x - startingLocation.x;
				var y = currentLocation.y - startingLocation.y;

				return {
					x: (x >= 0 ? x : x * -1),
					y: (y >= 0 ? y : y * -1)
				};
			}

			function swipe () {
				var x = currentLocation.x - startingLocation.x;
				var offset = getOffset();

				if (offset.x > offset.y && offset.x > 5) {
					lockedIn = true;
					setOffset(x)
				} else if (offset.y > offset.x && offset.y > 15) {
					lockedIn = false;
					setOffset(0);
					endSwipe();
					return;
				}

				visualUpdates = $window.requestAnimationFrame(swipe);
			}

			target.on('touchstart', function(event) {
				event.stopPropagation();

				var move = event.touches[0];
				startingLocation.x = move.pageX;
				currentLocation.x = move.pageX;
				startingLocation.y = move.pageY;
				currentLocation.y = move.pageY;

				threshold = element.offsetWidth / 2;
				visualUpdates = $window.requestAnimationFrame(swipe);
			});

			target.on('touchmove', function(event) {
				event.stopPropagation();

				if (lockedIn) {
					event.preventDefault();
				}

				var move = event.touches[0];
				currentLocation.x = move.pageX;
				currentLocation.y = move.pageY;
			});

			function endSwipe (event) {
				if (event) {
					event.stopPropagation();
				}
				$window.cancelAnimationFrame(visualUpdates);
				elementStyle.transition = 'transform .2s ease-out'
					+ ', opacity .2s ease-out'
					+ ', margin-bottom .2s ease-in-out';

				var offset = getOffset();
				if (offset.x < threshold) {
					// Didn't complete swipe
					setOffset(0);
					$timeout(resetStyles, 200);
					return;
				}

				// Completed swipe
				setOffset(threshold * ((currentLocation.x - startingLocation.x) < 0 ? -2 : 2));
				elementStyle.opacity = 0;
				onSwipe();
				$timeout(function() {
					elementStyle.marginBottom = (element.offsetHeight * -1) + 'px';
					$timeout(resetStyles, 200);
				}, 300);
			}

			target.on('touchend', endSwipe);
			target.on('click', endSwipe)
		}
	};
}

angular
	.module('app')
	.directive('swipeAway', SwipeAwayDirective);
