function MembershipsService ($mdToast, $http, $q, API, customerService, _) {
	var service = this;

	function notifyError (error) {
		$mdToast.show(
			$mdToast.simple()
				.content(error.message)
				.hideDelay(3000)
		);
		return $q.reject(error);
	}

	service.getMemberships = function() {
		var info = customerService.getSessionInfo();

		return $http({
			method: 'GET',
			url: API.customers + '/' + info.id + '/memberships',
			headers: {
				Authorization: info.token
			}
		})
			.catch(notifyError);
	};

	service.getSupplierMembership = function(supplierId) {
		return service
			.getMemberships()
			.then(function(memberships) {
				var membership = _.find(memberships, {supplier_id: supplierId});

				if (!membership || !membership.membership_number || membership.membership_number === '') {
					return $q.reject();
				}

				return membership;
			});
	};

	service.addMembership = function(membership) {
		var info = customerService.getSessionInfo();

		return $http({
			method: 'POST',
			url: API.customers + '/' + info.id + '/memberships',
			data: membership,
			headers: {
				Authorization: info.token
			}
		})
			.catch(notifyError);
	};

	service.updateMembership = function(membership) {
		var info = customerService.getSessionInfo();
		var membershipId = membership.id;

		delete membership.id;
		delete membership._metadata;

		return $http({
			method: 'PUT',
			url: API.customers + '/' + info.id + '/memberships/' + membershipId,
			data: membership,
			headers: {
				Authorization: info.token
			}
		})
			.catch(notifyError);
	};

	service.removeMembership = function(membership) {
		var info = customerService.getSessionInfo();

		return $http({
			method: 'DELETE',
			url: API.customers + '/' + info.id + '/memberships/' + membership.id,
			headers: {
				Authorization: info.token
			}
		})
			.catch(notifyError);
	};

	service.updateMemberships = function(memberships) {
		var info = customerService.getSessionInfo();

		return service
			.getMemberships()
			.then(function(existingMemberships) {
				var actions = [];

				existingMemberships.forEach(function(existingMembership) {
					var update = _.remove(memberships, function(membership) {
						return membership.supplier_id === existingMembership.supplier_id;
					})[0];

					if (!update) {
						return;
					}

					update.id = existingMembership.id;

					if (!update.membership_number || update.membership_number === '') {
						actions.push(service.removeMembership(update));
						return;
					}

					actions.push(service.updateMembership(update));
				});

				memberships.filter(function(membership) {
					return membership.membership_number && membership.membership_number !== '';
				}).forEach(function(membership) {
					actions.push(service.addMembership(membership));
				});

				return $q.all(actions);
			});
	};
}

angular
	.module('app')
	.service('membershipsService', MembershipsService);