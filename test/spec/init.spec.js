/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  beforeEach(function() {
    window.fetch.and.returnValue(this.homepageData(homepage));
  });

  describe('Test hyperGard Initialization', function() {
    describe('with no params', function() {
      beforeEach(function(done) {
        this.testHyperGard = new HyperGard();
        this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
      });

      it('should not make an fetch request', function() {
        expect(window.fetch).not.toHaveBeenCalled();
      });

      it('should not call resolve promise', function() {
        expect(this.onSuccess).not.toHaveBeenCalled();
      });

      it('should call reject promise with 1 param', function() {
        expect(this.onError.calls.mostRecent().args.length).toEqual(1);
      });

      it('should call fail promise with error object', function() {
        expect(this.onError).toHaveBeenCalledWith({
          error: {
            code: '0000',
            msg: 'API endpoint was not provided'
          }
        });
      });
    });

    describe('with options param and no endpoint', function() {
      beforeEach(function(done) {
        this.testHyperGard = new HyperGard(null, testOptions);
        this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
      });

      it('should not make an fetch request', function() {
        expect(window.fetch).not.toHaveBeenCalled();
      });

      it('should not call resolve promise', function() {
        expect(this.onSuccess).not.toHaveBeenCalled();
      });

      it('should call reject promise with 1 param', function() {
        expect(this.onError.calls.mostRecent().args.length).toEqual(1);
      });

      it('should call fail promise with error object', function() {
        expect(this.onError).toHaveBeenCalledWith({
          error: {
            code: '0000',
            msg: 'API endpoint was not provided'
          }
        });
      });
    });

    describe('with endpoint param and no options', function() {
      beforeEach(function(done) {
        this.testHyperGard = new HyperGard(testEndpoint);
        this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
      });

      it('should make an fetch request', function() {
        expect(window.fetch).toHaveBeenCalled();
      });

      it('should not call reject promise', function() {
        expect(this.onError).not.toHaveBeenCalled();
      });

      it('should call resolve promise', function() {
        expect(this.onSuccess).toHaveBeenCalled();
      });

      it('should call resolve promise with 1 param', function() {
        expect(this.onSuccess.calls.mostRecent().args.length).toEqual(1);
      });

      it('should call resolve promise with result object', function() {
        expect(this.onSuccess.calls.mostRecent().args[0]).toEqual(jasmine.any(Object));
      });
    });

    describe('with valid params', function() {
      beforeEach(function() {
        this.testHyperGard = new HyperGard(testEndpoint, testOptions);
      });

      describe('fetch request params', function() {
        beforeEach(function(done) {
          this.testHyperGard.fetch().then(done);
        });

        it('should call fetch with correct params', function() {
          expect(window.fetch).toHaveBeenCalledWith(testEndpoint, jasmine.any(Object));
        });

        it('should pass correct xhr options', function() {
          expect(window.fetch.calls.argsFor(0)[1].headers.Authorization).toEqual('auth');
        });
      });

      describe('fetch request failed', function() {
        beforeEach(function(done) {
          this.xhr500 = this.homepageData('', 500);
          window.fetch.and.returnValue(this.xhr500);
          this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
        });

        it('should make fetch request', function() {
          expect(window.fetch).toHaveBeenCalled();
        });

        it('should not call resolve promise', function() {
          expect(this.onSuccess).not.toHaveBeenCalled();
        });

        it('should call reject promise with 1 param', function() {
          expect(this.onError.calls.mostRecent().args.length).toEqual(1);
        });

        it('should call reject promise with error object', function() {
          expect(this.onError).toHaveBeenCalledWith({
            error: {
              code: '0001',
              msg: 'Failed to retrieve homepage'
            },

            xhr: this.xhr500
          });
        });
      });

      describe('two requests in succession', function() {
        beforeEach(function(done) {
          this.testHyperGard.fetch();
          this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
        });

        it('should make one fetch request', function() {
          expect(window.fetch.calls.count()).toEqual(1);
        });
      });

      describe('two requests in succession with cacheHomepage enabled', function() {
        beforeEach(function(done) {
          this.testHyperGard.setOptions({ cacheHomepage: true });
          this.testHyperGard.fetch();
          this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
        });

        it('should make one fetch request', function() {
          expect(window.fetch.calls.count()).toEqual(1);
        });
      });

      describe('fetch succeeded with invalid responses', function() {
        describe('returned array', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData([]);
            window.fetch.and.returnValue(this.testResponse);
            this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call resolve promise', function() {
            expect(this.onSuccess).not.toHaveBeenCalled();
          });

          it('should call reject promise with 1 param', function() {
            expect(this.onError.calls.mostRecent().args.length).toEqual(1);
          });

          it('should call reject promise with error object', function() {
            expect(this.onError).toHaveBeenCalledWith({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },

              xhr: this.testResponse
            });
          });
        });

        describe('returned boolean - true', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(true);
            window.fetch.and.returnValue(this.testResponse);
            this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call resolve promise', function() {
            expect(this.onSuccess).not.toHaveBeenCalled();
          });

          it('should call reject promise with 1 param', function() {
            expect(this.onError.calls.mostRecent().args.length).toEqual(1);
          });

          it('should call reject promise with error object', function() {
            expect(this.onError).toHaveBeenCalledWith({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },

              xhr: this.testResponse
            });
          });
        });

        describe('returned boolean - false', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(false);
            window.fetch.and.returnValue(this.testResponse);
            this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call resolve promise', function() {
            expect(this.onSuccess).not.toHaveBeenCalled();
          });

          it('should call reject promise with 1 param', function() {
            expect(this.onError.calls.mostRecent().args.length).toEqual(1);
          });

          it('should call reject promise with error object', function() {
            expect(this.onError).toHaveBeenCalledWith({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },

              xhr: this.testResponse
            });
          });
        });

        describe('returned number', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(1);
            window.fetch.and.returnValue(this.testResponse);
            this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call resolve promise', function() {
            expect(this.onSuccess).not.toHaveBeenCalled();
          });

          it('should call reject promise with 1 param', function() {
            expect(this.onError.calls.mostRecent().args.length).toEqual(1);
          });

          it('should call reject promise with error object', function() {
            expect(this.onError).toHaveBeenCalledWith({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },

              xhr: this.testResponse
            });
          });
        });

        describe('returned string', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData('string');
            window.fetch.and.returnValue(this.testResponse);
            this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call resolve promise', function() {
            expect(this.onSuccess).not.toHaveBeenCalled();
          });

          it('should call reject promise with 1 param', function() {
            expect(this.onError.calls.mostRecent().args.length).toEqual(1);
          });

          it('should call reject promise with error object', function() {
            expect(this.onError).toHaveBeenCalledWith({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },

              xhr: this.testResponse
            });
          });
        });
      });

      describe('fetch succeeded with valid response', function() {
        beforeEach(function(done) {
          this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
        });

        describe('validate response', function() {
          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should not call reject promise', function() {
            expect(this.onError).not.toHaveBeenCalled();
          });

          it('should call resolve promise', function() {
            expect(this.onSuccess).toHaveBeenCalled();
          });

          it('should call resolve promise with 1 param', function() {
            expect(this.onSuccess.calls.mostRecent().args.length).toEqual(1);
          });
        });

        describe('validate fetch request', function() {
          it('passes correct params to fetch request', function() {
            expect(window.fetch).toHaveBeenCalledWith('/endpoint/', {
              action: jasmine.any(String),
              headers: jasmine.any(Object),
              method: jasmine.any(String),
            });
          });
        });
      });
    });
  });
});
