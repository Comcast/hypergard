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

  describe('Test 204 response', function() {
    beforeEach(function(done) {
      this.link = this.data.getFirstAction('twoParamsPath', {
        path1: 'path1',
        path2: 'path2'
      });

      window.fetch.and.returnValue(this.homepageData('', 204));
      this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
    });

    it('should return empty data response', function() {
      expect(this.actionData).toEqual('');
    });
  });
});
