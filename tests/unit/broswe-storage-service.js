describe('BrowserStorageService', function() {
	var browserStorage;

	beforeEach(module('app'));

	beforeEach(inject(function(_browserStorage_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		browserStorage = _browserStorage_;
	}));

	describe('browserStorage', function() {
		it('sets and retrieves a string', function() {
			browserStorage.setItem('foo', 'bar');

			expect(browserStorage.getItem('foo')).toEqual('bar');
		});

		it('allows a specific value to be removed', function() {
			browserStorage.setItem('foo', 'bar');
			browserStorage.removeItem('foo');
			expect(browserStorage.getItem('foo')).toBe(null);
		});

		it('allows all values to be removed', function() {
			browserStorage.setItem('foo', 'bar');
			browserStorage.setItem('bar', 'baz');

			browserStorage.clear();

			expect(browserStorage.getItem('foo')).toBe(null);
			expect(browserStorage.getItem('bar')).toBe(null);
		});
	});
});
