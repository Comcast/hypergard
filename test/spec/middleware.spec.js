/**
 * @author Brendan.Davies
 * @comment Testing middleware stack
 */
describe('Middleware', function() {
  var customHeader1 = {
    'X-CustomHeader1': true,
  };
  var customHeader2 ={
    'X-CustomHeader2': true,
  };
  var mockLogger = {
    log: function() {},
  };

  function headerMiddlewareOne(url, options, next) {
    var newOptions = deepExtend({}, options, { headers: customHeader1});
    return next(url, newOptions);
  }

  function headerMiddlewareTwo(url, options, next) {
    var newOptions = deepExtend({}, options, { headers: customHeader2});
    return next(url, newOptions);
  }

  function loggerMiddleware(url, options, next) {
    var result = next(url, options);

    mockLogger.log('headers', options.headers);
    result
      .then(function(response) {
        mockLogger.log('success', {status: response.status});
      })
      .catch(function(error) {
        mockLogger.log('failure', {error: error.status});
      })

    return result;
  }

  beforeEach(function() {
    window.fetch.and.returnValue(this.homepageData(homepage));
    this.testHyperGard = new HyperGard(testEndpoint, testOptions);
    this.testHyperGard.applyMiddlewareStack([
      headerMiddlewareOne,
      headerMiddlewareTwo,
      loggerMiddleware,
    ]);
  });

  describe('applyMiddlewareStack, manipulating request prior to fetch', function() {
    beforeEach(function(done) {
      this.testHyperGard.fetch().then(done, done);
    });

    it('Expect homepage endpoint to be called', function() {
      expect(window.fetch).toHaveBeenCalledWith(testEndpoint, jasmine.any(Object));
    });

    it('Expect each mock header to be set, before fetch', function() {
      var expectedHeaders = deepExtend({}, customHeader1, customHeader2);
      expect(window.fetch).toHaveBeenCalledWith(
        testEndpoint,
        {
          headers: jasmine.objectContaining(expectedHeaders),
        }
      );
    });
  });

  describe('applyMiddlewareStack, responding to success', function() {
    beforeEach(function(done) {
      spyOn(mockLogger, 'log');
      this.testHyperGard.fetch().then(done, done);
    });

    it('Logger is called after both headers are set', function() {
      var expectedHeaders = deepExtend({}, customHeader1, customHeader2);
      expect(mockLogger.log).toHaveBeenCalledWith(
        'headers',
        jasmine.objectContaining(expectedHeaders)
      );
    });

    it('To be called after fetch on success', function() {
      expect(mockLogger.log).toHaveBeenCalledWith('success', {status: 200});
    });
  });

  describe('applyMiddlewareStack, responding to rejection', function() {
    beforeEach(function(done) {
      spyOn(mockLogger, 'log');
      window.fetch.and.returnValue(this.homepageData('', 500));
      this.testHyperGard.fetch().then(done, done);
    });

    it('To be called after fetch on failure', function() {
      expect(mockLogger.log).toHaveBeenCalledWith('failure', {error: 500});
    });
  });
});