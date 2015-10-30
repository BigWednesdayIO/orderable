describe('basic authentication interceptor', function() {
	var $rootScope,
		$q,
		BasicValidationInterceptor,
		responseData,
		errorOccurred;

	function jsonHeaders () {
		return {
			'content-type': 'application/json'
		};
	}

	beforeEach(module('app'));

	beforeEach(function() {
		inject(function(_$rootScope_, _$q_, _BasicValidationInterceptor_) {
			$rootScope = _$rootScope_;
			$q = _$q_;
			BasicValidationInterceptor = _BasicValidationInterceptor_
		});
	});

	it('is defined', function() {
		expect(BasicValidationInterceptor).toBeDefined();
	});

	describe('a json response response', function() {
		beforeEach(function() {
			responseData = null;
		});

		it('accepts an array', function() {
			var data = [
				'foo',
				'bar'
			];

			BasicValidationInterceptor
				.response({
					headers: jsonHeaders,
					data: data
				})
				.then(function(_responseData_) {
					responseData = _responseData_;
				});

			$rootScope.$apply();
				
			expect(responseData).toEqual(data);
		});

		it('accepts an object', function() {
			var data = {
				foo: 'bar'
			};

			BasicValidationInterceptor
				.response({
					headers: jsonHeaders,
					data: data
				})
				.then(function(_responseData_) {
					responseData = _responseData_;
				});

			$rootScope.$apply();
				
			expect(responseData).toEqual(data);
		});

		describe('with an empty response body', function() {
			beforeEach(function() {
				errorOccurred = false;
			});

			it('accepts a 204', function() {
				BasicValidationInterceptor
					.response({
						headers: jsonHeaders,
						status: 204
					})
					.catch(function() {
						errorOccurred = true;
					});

				$rootScope.$apply();

				expect(errorOccurred).toBe(false);
			});

			it('rejects non-204 responses', function() {
				BasicValidationInterceptor
					.response({
						headers: jsonHeaders,
						config: {
							url: 'http://foo.bar'
						},
						status: 200
					})
					.catch(function() {
						errorOccurred = true;
					});

				$rootScope.$apply();

				expect(errorOccurred).toBe(true);
			});
		});
	});
});
