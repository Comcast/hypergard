/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  beforeEach(function() {
    this.testHyperGard = new HyperGard(testEndpoint, testOptions);
  });

  describe('Test hyperGard parse', function() {
    it('should return a parsed Resource', function() {
      expect(this.testHyperGard.parse({})).toEqual(jasmine.any(Object));
    });

    it('should return an empty parsed Resource', function() {
      expect(this.testHyperGard.parse()).toEqual(jasmine.any(Object));
    });
  });
});
