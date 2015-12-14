function DropdownMenuDirective ($rootScope, $timeout, eventWrapper) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			var btn = angular.element(element[0].querySelector('[dropdown-button]'));
			var timer;

			function closeDropdown (delay) {
				timer = $timeout(function() {
					element.removeClass('is-open');
				}, delay);
			}

			function tappedAway (event) {
				if (event.target.closest('[dropdown-menu]')) {
					return;
				}
				closeDropdown(0);
			}

			if (!btn) {
				return;
			}

			btn.on('click', function() {
				element.toggleClass('is-open');
			});

			element.on('mouseleave', function() {
				closeDropdown(250)
			});

			element.on('mouseenter', function() {
				$timeout.cancel(timer);
			});

			eventWrapper.addEventListener('click', tappedAway, false);

			scope.$on('$destroy', function() {
				eventWrapper.removeEventListener('click', tappedAway, false);
			});

			$rootScope.$on('$stateChangeSuccess', function() {
				closeDropdown(0);
			});
		}
	}	
}

angular
	.module('app')
	.directive('dropdownMenu', DropdownMenuDirective);
