/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  beforeEach(function() {
    this.testHyperGard = new HyperGard(testEndpoint, testOptions);
  });

  describe('Test hyperGard options', function() {
    describe('getOptions', function() {
      it('should have getOptions api', function() {
        expect(this.testHyperGard.getOptions).toEqual(jasmine.any(Function));
      });

      it('it should get preloadHomepage option', function() {
        expect(this.testHyperGard.getOptions().preloadHomepage).toEqual(false);
      });

      it('it should get cacheHomepage option', function() {
        expect(this.testHyperGard.getOptions().cacheHomepage).toEqual(false);
      });

      it('it should get debug option', function() {
        expect(this.testHyperGard.getOptions().debug).toEqual(true);
      });

      it('it should get fetch options', function() {
        expect(this.testHyperGard.getOptions().xhr.headers.auth).toEqual(testOptions.xhr.headers.auth);
      });
    });

    describe('setOptions', function() {
      it('should have setOptions api', function() {
        expect(this.testHyperGard.setOptions).toEqual(jasmine.any(Function));
      });

      it('it should set debug option', function() {
        this.testHyperGard.setOptions({ debug: false });
        expect(this.testHyperGard.getOptions().debug).toEqual(false);
      });

      it('it should not change debug option', function() {
        this.testHyperGard.setOptions();
        expect(this.testHyperGard.getOptions().debug).toEqual(true);
      });
    });
  });
});
