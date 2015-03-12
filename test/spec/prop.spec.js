/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  beforeEach(function(done) {
    window.fetch.and.returnValue(this.homepageData(homepage));
    this.testHyperGard = new HyperGard(testEndpoint, testOptions);
    this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
  });

  describe('Test retrieval of properties', function() {
    describe('by using getProp function', function() {
      it('calls getProp with array', function() {
        expect(this.data.getProp([])).toBeUndefined();
      });

      describe('calls getProp with boolean', function() {
        it('calls getProp with true', function() {
          expect(this.data.getProp(true)).toBeUndefined();
        });

        it('calls getProp with false', function() {
          expect(this.data.getProp(false)).toBeUndefined();
        });
      });

      it('calls getProp with null', function() {
        expect(this.data.getProp(null)).toBeUndefined();
      });

      it('calls getProp with number', function() {
        expect(this.data.getProp(1)).toBeUndefined();
      });

      it('calls getProp with string', function() {
        expect(this.data.getProp('string')).toBeUndefined();
      });

      it('calls getProp with object', function() {
        expect(this.data.getProp({})).toBeUndefined();
      });

      it('calls getProp with undefined', function() {
        expect(this.data.getProp(undefined)).toBeUndefined();
      });
    });

    describe('by using getProps function', function() {
      it('calls getProps', function() {
        expect(this.data.getProps()).toEqual(jasmine.any(Object));
      });
    });
  });
});
