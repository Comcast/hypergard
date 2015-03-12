/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  beforeEach(function(done) {
    window.fetch.and.returnValue(new Promise(function() {}));
    this.testHyperGard = new HyperGard(testEndpoint, {
      preloadHomepage: false,
      xhr: {
        timeout: 1
      }
    });
    this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
  });

  describe('Test fetch timeout', function() {
    it('should not return data', function() {
      expect(this.data).toBe(null);
    });

    it('should return proper error object', function() {
      expect(this.error).toEqual({
        error: {
          code: '0011',
          msg: 'Fetch timeout',
          timeout: 1
        }
      });
    });
  });
});
