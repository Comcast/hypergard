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

  describe('Test hyperGard data', function() {
    describe('response api', function() {
      it('should have getEmbedded function', function() {
        expect(this.data.getEmbedded).toEqual(jasmine.any(Function));
      });

      it('should have getAction function', function() {
        expect(this.data.getAction).toEqual(jasmine.any(Function));
      });

      it('should have getFirstAction function', function() {
        expect(this.data.getFirstAction).toEqual(jasmine.any(Function));
      });

      it('should have getBase function', function() {
        expect(this.data.getBase).toEqual(jasmine.any(Function));
      });

      it('should have getParent function', function() {
        expect(this.data.getParent).toEqual(jasmine.any(Function));
      });

      it('should have getProp function', function() {
        expect(this.data.getProp).toEqual(jasmine.any(Function));
      });

      it('should have getProps function', function() {
        expect(this.data.getProps).toEqual(jasmine.any(Function));
      });

      it('should have hasAction function', function() {
        expect(this.data.hasAction).toEqual(jasmine.any(Function));
      });

      it('should have hasEmbedded function', function() {
        expect(this.data.hasEmbedded).toEqual(jasmine.any(Function));
      });

      it('should have hasForm function', function() {
        expect(this.data.hasForm).toEqual(jasmine.any(Function));
      });

      it('should have hasLink function', function() {
        expect(this.data.hasLink).toEqual(jasmine.any(Function));
      });

      it('should have listActions function', function() {
        expect(this.data.listActions).toEqual(jasmine.any(Function));
      });

      it('should have listEmbedded function', function() {
        expect(this.data.listEmbedded).toEqual(jasmine.any(Function));
      });
    });

    describe('homepage data', function() {
      it('should have base equal to /endpoint/', function() {
        expect(this.data.getBase()).toEqual('/endpoint/');
      });

      it('should return a parent of homepage data', function() {
        expect(this.data.getParent()).toEqual(this.data);
      });

      it('should not have a property test', function() {
        expect(this.data.getProp('test')).toBeUndefined();
      });

      it('should have empty properties object', function() {
        expect(this.data.getProps()).toEqual(jasmine.any(Object));
        expect(Object.keys(this.data.getProps()).length).toEqual(0);
      });
    });

    describe('retrieving a link', function() {
      describe('fetch link with no href', function() {
        beforeEach(function(done) {
          this.link = this.data.getFirstAction('noHref');
          this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
        });

        it('should make fetch request', function() {
          expect(window.fetch).toHaveBeenCalled();
        });

        it('should not call resolve promise', function() {
          expect(this.onActionSuccess).not.toHaveBeenCalled();
        });

        it('should call reject promise with 1 param', function() {
          expect(this.onActionError.calls.mostRecent().args.length).toEqual(1);
        });

        it('should call reject promise with error object', function() {
          expect(this.onActionError).toHaveBeenCalledWith({
            error: {
              action: 'noHref',
              code: '0020',
              msg: 'Url is not provided for this action'
            }
          });
        });
      });

      describe('fetch request failed', function() {
        beforeEach(function(done) {
          this.link = this.data.getFirstAction('absoluteUrl');
          this.xhr500 = this.homepageData('', 500);
          window.fetch.and.returnValue(this.xhr500);
          this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
        });

        it('should make fetch request', function() {
          expect(window.fetch).toHaveBeenCalled();
        });

        it('should not call resolve promise', function() {
          expect(this.onActionSuccess).not.toHaveBeenCalled();
        });

        it('should call reject promise with 1 param', function() {
          expect(this.onActionError.calls.mostRecent().args.length).toEqual(1);
        });

        it('should call reject promise with error object', function() {
          expect(this.onActionError).toHaveBeenCalledWith({
            error: {
              action: 'absoluteUrl',
              code: '0021',
              msg: 'Failed to retrieve action'
            },
            xhr: this.xhr500
          });
        });
      });

      describe('fetch succeeded with invalid responses', function() {
        beforeEach(function() {
          this.link = this.data.getFirstAction('absoluteUrl');
        });

        describe('returned array', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData([]);
            window.fetch.and.returnValue(this.testResponse);
            this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should call resolve promise', function() {
            expect(this.onActionSuccess).toHaveBeenCalled();
          });

          it('should not call reject promise', function() {
            expect(this.onActionError).not.toHaveBeenCalled();
          });
        });

        describe('returned boolean - true', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(true);
            window.fetch.and.returnValue(this.testResponse);
            this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should call resolve promise', function() {
            expect(this.onActionSuccess).toHaveBeenCalled();
          });

          it('should not call reject promise', function() {
            expect(this.onActionError).not.toHaveBeenCalled();
          });
        });

        describe('returned boolean - false', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(false);
            window.fetch.and.returnValue(this.testResponse);
            this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should call resolve promise', function() {
            expect(this.onActionSuccess).toHaveBeenCalled();
          });

          it('should not call reject promise', function() {
            expect(this.onActionError).not.toHaveBeenCalled();
          });
        });

        describe('returned number', function() {
          beforeEach(function(done) {
            this.testResponse = this.homepageData(1);
            window.fetch.and.returnValue(this.testResponse);
            this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('should call resolve promise', function() {
            expect(this.onActionSuccess).toHaveBeenCalled();
          });

          it('should not call reject promise', function() {
            expect(this.onActionError).not.toHaveBeenCalled();
          });
        });

        describe('with returnRawResponse option', function() {
          var baseResponse = { a: 1 };
          var processedResponse;

          beforeEach(function() {
            this.testResponse = this.homepageData(baseResponse);
            window.fetch.and.returnValue(this.testResponse);

            return this.link.fetch({ returnRawData: true }).then(function (result) {
              processedResponse = result.data;
            });
          });

          it('should make fetch request', function() {
            expect(window.fetch).toHaveBeenCalled();
          });

          it('it should return raw response', function() {
            expect(processedResponse).toEqual(baseResponse);
          });
        });
      });

      describe('response api', function() {
        beforeEach(function(done) {
          this.link = this.data.getFirstAction('twoParamsPath', {
            path1: 'path1',
            path2: 'path2'
          });

          window.fetch.and.returnValue(this.homepageData(actionResponse));
          this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
        });

        it('should have getEmbedded function', function() {
          expect(this.actionData.getEmbedded).toEqual(jasmine.any(Function));
        });

        it('should have getAction function', function() {
          expect(this.actionData.getAction).toEqual(jasmine.any(Function));
        });

        it('should have getFirstAction function', function() {
          expect(this.actionData.getFirstAction).toEqual(jasmine.any(Function));
        });

        it('should have getBase function', function() {
          expect(this.actionData.getBase).toEqual(jasmine.any(Function));
        });

        it('should have getParent function', function() {
          expect(this.actionData.getParent).toEqual(jasmine.any(Function));
        });

        it('should have getProp function', function() {
          expect(this.actionData.getProp).toEqual(jasmine.any(Function));
        });

        it('should have getProps function', function() {
          expect(this.actionData.getProps).toEqual(jasmine.any(Function));
        });

        it('should have hasAction function', function() {
          expect(this.actionData.hasAction).toEqual(jasmine.any(Function));
        });

        it('should have hasEmbedded function', function() {
          expect(this.actionData.hasEmbedded).toEqual(jasmine.any(Function));
        });

        it('should have hasForm function', function() {
          expect(this.actionData.hasForm).toEqual(jasmine.any(Function));
        });

        it('should have hasLink function', function() {
          expect(this.actionData.hasLink).toEqual(jasmine.any(Function));
        });

        it('should have listActions function', function() {
          expect(this.actionData.listActions).toEqual(jasmine.any(Function));
        });

        it('should have listEmbedded function', function() {
          expect(this.actionData.listEmbedded).toEqual(jasmine.any(Function));
        });
      });

      describe('response data - link', function() {
        beforeEach(function(done) {
          this.link = this.data.getFirstAction('twoParamsPath', {
            path1: 'path1',
            path2: 'path2'
          });

          window.fetch.and.returnValue(this.homepageData(actionResponse));
          this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
        });

        it('should have proper base endpoint', function() {
          expect(this.actionData.getBase()).toEqual('/endpoint/two/params/path1/path2/');
        });

        it('should have proper parent', function() {
          expect(this.actionData.getParent()).toEqual(this.actionData);
        });

        describe('embedded data', function() {
          describe('getEmbedded', function() {
            it('should return an object for embedded `one`', function() {
              expect(this.actionData.getEmbedded('one')).toEqual(jasmine.any(Object));
            });

            it('should return an array for embedded `two`', function() {
              expect(this.actionData.getEmbedded('two')).toEqual(jasmine.any(Array));
            });
          });

          describe('fetchEmbedded', function() {
            describe('it has the embedded object', function() {
              beforeEach(function(done) {
                this.embedded = this.actionData.getEmbedded('two')[0];
                this.embedded.fetchEmbedded('sub_two').then(function(subData) {
                  this.subEmbedded = subData.data;
                  done();
                }.bind(this));
              });

              it('should return a sub_two embedded object', function() {
                expect(this.subEmbedded).toEqual(this.actionData.getEmbedded('two')[0].getEmbedded('sub_two'));
              });
            });

            describe('it does not have the embedded object', function() {
              beforeEach(function(done) {
                this.embedded = this.actionData.getEmbedded('two')[0];
                this.embedded.fetchEmbedded('linkedEmbedded').then(this.onActionSuccess, this.onActionError).then(done, done);
              });

              it('should make fetch request', function() {
                expect(window.fetch).toHaveBeenCalled();
              });

              it('should call resolve promise', function() {
                expect(this.onActionSuccess).toHaveBeenCalled();
              });

              it('should not call reject promise', function() {
                expect(this.onActionError).not.toHaveBeenCalled();
              });
            });
          });

          describe('hasEmbedded', function() {
            it('should return true for embedded `one`', function() {
              expect(this.actionData.hasEmbedded('one')).toBe(true);
            });

            it('should return true for embedded `two`', function() {
              expect(this.actionData.hasEmbedded('two')).toBe(true);
            });

            it('should return false for embedded `noembedded`', function() {
              expect(this.actionData.hasEmbedded('noembedded')).toEqual(false);
            });
          });

          describe('listEmbedded', function() {
            it('should return an array', function() {
              expect(this.actionData.listEmbedded()).toEqual(jasmine.any(Array));
            });

            it('should return a list of 3', function() {
              expect(this.actionData.listEmbedded().length).toEqual(3);
            });

            it('should return a list of embedded objects', function() {
              expect(this.actionData.listEmbedded()).toEqual(['one', 'two', 'three']);
            });
          });

          describe('embedded api', function() {
            beforeEach(function() {
              this.embedded = this.actionData.getEmbedded('one');
            });

            it('should have proper base', function() {
              expect(this.embedded.getBase()).toEqual(this.actionData.getBase());
            });

            it('should have proper parent', function() {
              expect(this.embedded.getParent()).toEqual(this.actionData);
            });

            it('should have getEmbedded function', function() {
              expect(this.embedded.getEmbedded).toEqual(jasmine.any(Function));
            });

            it('should have getAction function', function() {
              expect(this.embedded.getAction).toEqual(jasmine.any(Function));
            });

            it('should have getFirstAction function', function() {
              expect(this.embedded.getFirstAction).toEqual(jasmine.any(Function));
            });

            it('should have getBase function', function() {
              expect(this.embedded.getBase).toEqual(jasmine.any(Function));
            });

            it('should have getProp function', function() {
              expect(this.embedded.getProp).toEqual(jasmine.any(Function));
            });

            it('should have getProps function', function() {
              expect(this.embedded.getProps).toEqual(jasmine.any(Function));
            });

            it('should have getRoot function', function() {
              expect(this.embedded.getRoot).toEqual(jasmine.any(Function));
            });

            it('should have hasAction function', function() {
              expect(this.embedded.hasAction).toEqual(jasmine.any(Function));
            });

            it('should have hasEmbedded function', function() {
              expect(this.embedded.hasEmbedded).toEqual(jasmine.any(Function));
            });

            it('should have hasForm function', function() {
              expect(this.embedded.hasForm).toEqual(jasmine.any(Function));
            });

            it('should have hasLink function', function() {
              expect(this.embedded.hasLink).toEqual(jasmine.any(Function));
            });

            it('should have listActions function', function() {
              expect(this.embedded.listActions).toEqual(jasmine.any(Function));
            });

            it('should have listEmbedded function', function() {
              expect(this.embedded.listEmbedded).toEqual(jasmine.any(Function));
            });

            describe('getRoot', function() {
              it('should return root level resource', function() {
                expect(this.embedded.getRoot()).toEqual(this.actionData);
              });
            });
          });

          describe('cached link', function() {
            beforeEach(function(done) {
              window.fetch.calls.reset();
              this.embedded = this.actionData.getEmbedded('two')[0];
              this.link = this.embedded.getFirstAction('self');
              this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
            });

            it('should not make fetch request', function() {
              expect(window.fetch).not.toHaveBeenCalled();
            });

            it('should call resolve promise', function() {
              expect(this.onActionSuccess).toHaveBeenCalled();
            });

            it('should not call reject promise', function() {
              expect(this.onActionError).not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('response data - form', function() {
        beforeEach(function(done) {
          this.link = this.data.getFirstAction('formPostOneField', {
            param: 'param'
          });

          window.fetch.and.returnValue(this.homepageData(actionResponse));
          this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
        });

        it('should have proper base endpoint', function() {
          expect(this.actionData.getBase()).toEqual('/endpoint/form/');
        });

        it('should have proper parent', function() {
          expect(this.actionData.getParent()).toEqual(this.actionData);
        });

        describe('embedded data', function() {
          describe('getEmbedded', function() {
            it('should return an object for embedded `one`', function() {
              expect(this.actionData.getEmbedded('one')).toEqual(jasmine.any(Object));
            });

            it('should return an array for embedded `two`', function() {
              expect(this.actionData.getEmbedded('two')).toEqual(jasmine.any(Array));
            });
          });

          describe('fetchEmbedded', function() {
            describe('it has the embedded object', function() {
              beforeEach(function(done) {
                this.embedded = this.actionData.getEmbedded('two')[0];
                this.embedded.fetchEmbedded('sub_two').then(function(subData) {
                  this.subEmbedded = subData.data;
                  done();
                }.bind(this));
              });

              it('should return a sub_two embedded object', function() {
                expect(this.subEmbedded).toEqual(this.actionData.getEmbedded('two')[0].getEmbedded('sub_two'));
              });
            });

            describe('it does not have the embedded object', function() {
              beforeEach(function(done) {
                this.embedded = this.actionData.getEmbedded('two')[0];
                this.embedded.fetchEmbedded('linkedEmbedded').then(this.onActionSuccess, this.onActionError).then(done, done);
              });

              it('should make fetch request', function() {
                expect(window.fetch).toHaveBeenCalled();
              });

              it('should call resolve promise', function() {
                expect(this.onActionSuccess).toHaveBeenCalled();
              });

              it('should not call reject promise', function() {
                expect(this.onActionError).not.toHaveBeenCalled();
              });
            });
          });

          describe('hasEmbedded', function() {
            it('should return true for embedded `one`', function() {
              expect(this.actionData.hasEmbedded('one')).toBe(true);
            });

            it('should return true for embedded `two`', function() {
              expect(this.actionData.hasEmbedded('two')).toBe(true);
            });

            it('should return false for embedded `noembedded`', function() {
              expect(this.actionData.hasEmbedded('noembedded')).toEqual(false);
            });
          });

          describe('listEmbedded', function() {
            it('should return an array', function() {
              expect(this.actionData.listEmbedded()).toEqual(jasmine.any(Array));
            });

            it('should return a list of 3', function() {
              expect(this.actionData.listEmbedded().length).toEqual(3);
            });

            it('should return a list of embedded objects', function() {
              expect(this.actionData.listEmbedded()).toEqual(['one', 'two', 'three']);
            });
          });

          describe('embedded api', function() {
            beforeEach(function() {
              this.embedded = this.actionData.getEmbedded('one');
            });

            it('should have proper base', function() {
              expect(this.embedded.getBase()).toEqual(this.actionData.getBase());
            });

            it('should have proper parent', function() {
              expect(this.embedded.getParent()).toEqual(this.actionData);
            });

            it('should have getEmbedded function', function() {
              expect(this.embedded.getEmbedded).toEqual(jasmine.any(Function));
            });

            it('should have getAction function', function() {
              expect(this.embedded.getAction).toEqual(jasmine.any(Function));
            });

            it('should have getFirstAction function', function() {
              expect(this.embedded.getFirstAction).toEqual(jasmine.any(Function));
            });

            it('should have getBase function', function() {
              expect(this.embedded.getBase).toEqual(jasmine.any(Function));
            });

            it('should have getProp function', function() {
              expect(this.embedded.getProp).toEqual(jasmine.any(Function));
            });

            it('should have getProps function', function() {
              expect(this.embedded.getProps).toEqual(jasmine.any(Function));
            });

            it('should have hasAction function', function() {
              expect(this.embedded.hasAction).toEqual(jasmine.any(Function));
            });

            it('should have hasEmbedded function', function() {
              expect(this.embedded.hasEmbedded).toEqual(jasmine.any(Function));
            });

            it('should have hasForm function', function() {
              expect(this.embedded.hasForm).toEqual(jasmine.any(Function));
            });

            it('should have hasLink function', function() {
              expect(this.embedded.hasLink).toEqual(jasmine.any(Function));
            });

            it('should have listActions function', function() {
              expect(this.embedded.listActions).toEqual(jasmine.any(Function));
            });

            it('should have listEmbedded function', function() {
              expect(this.embedded.listEmbedded).toEqual(jasmine.any(Function));
            });
          });

          describe('cached link', function() {
            beforeEach(function(done) {
              window.fetch.calls.reset();
              this.embedded = this.actionData.getEmbedded('two')[0];
              this.link = this.embedded.getFirstAction('self');
              this.link.fetch().then(this.onActionSuccess, this.onActionError).then(done, done);
            });

            it('should not make fetch request', function() {
              expect(window.fetch).not.toHaveBeenCalled();
            });

            it('should call resolve promise', function() {
              expect(this.onActionSuccess).toHaveBeenCalled();
            });

            it('should not call reject promise', function() {
              expect(this.onActionError).not.toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
