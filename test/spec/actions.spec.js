/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
describe('hyperGard', function() {
  describe('Test hyperGard handling of actions', function() {
    beforeEach(function(done) {
      window.fetch.and.returnValue(this.homepageData(homepage));
      this.testHyperGard = new HyperGard(testEndpoint, testOptions);
      this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
    });

    describe('test action api', function() {
      describe('hasAction', function() {
        it('should have a hasAction api', function() {
          expect(this.data.hasAction).toEqual(jasmine.any(Function));
        });

        it('should return a boolean', function() {
          expect(this.data.hasAction()).toEqual(jasmine.any(Boolean));
        });

        it('should return true if the data has a form with the action name', function() {
          expect(this.data.hasAction('formNoAction')).toEqual(true);
        });

        it('should return true if the data has a link with the action name', function() {
          expect(this.data.hasAction('self')).toEqual(true);
        });

        it('should return false if the data does not have a link or a form with the action nam', function() {
          expect(this.data.hasAction('foo')).toEqual(false);
        });
      });

      describe('hasForm', function() {
        it('should have a hasForm api', function() {
          expect(this.data.hasForm).toEqual(jasmine.any(Function));
        });

        it('should return a boolean', function() {
          expect(this.data.hasForm()).toEqual(jasmine.any(Boolean));
        });

        it('should return true if the data has the form', function() {
          expect(this.data.hasForm('formNoAction')).toEqual(true);
        });

        it('should return false if the data does not have the form', function() {
          expect(this.data.hasForm('foo')).toEqual(false);
        });
      });

      describe('hasLink', function() {
        it('should have a hasLink api', function() {
          expect(this.data.hasLink).toEqual(jasmine.any(Function));
        });

        it('should return a boolean', function() {
          expect(this.data.hasLink()).toEqual(jasmine.any(Boolean));
        });

        it('should return true if the data has the action', function() {
          expect(this.data.hasLink('self')).toEqual(true);
        });

        it('should return false if the data does not hav the action', function() {
          expect(this.data.hasLink('foo')).toEqual(false);
        });
      });

      describe('listActions', function() {
        it('should have listAction api', function() {
          expect(this.data.listActions).toEqual(jasmine.any(Function));
        });

        it('should return an object', function() {
          expect(this.data.listActions()).toEqual(jasmine.any(Object));
        });

        it('should have key links', function() {
          expect(this.data.listActions().links).toBeDefined();
        });

        it('should have links defined as object', function() {
          expect(this.data.listActions().links).toEqual(jasmine.any(Array));
        });

        it('should have key forms', function() {
          expect(this.data.listActions().forms).toBeDefined();
        });

        it('should have forms defined as object', function() {
          expect(this.data.listActions().forms).toEqual(jasmine.any(Array));
        });
      });

      describe('getAction', function() {
        it('should have getAction api', function() {
          expect(this.data.getAction).toEqual(jasmine.any(Function));
        });

        describe('getAction responses', function() {
          it('should return list of available actions', function() {
            expect(this.data.getAction()).toEqual(jasmine.any(Array));
          });

          it('getAction should return empty array', function() {
            expect(this.data.getAction().length).toEqual(0);
          });
        });
      });

      describe('getFirstAction', function() {
        it('should have getFirstAction api', function() {
          expect(this.data.getFirstAction).toEqual(jasmine.any(Function));
        });

        describe('getFirstAction responses', function() {
          it('calls getFirstAction with no params', function() {
            expect(this.data.getFirstAction()).toEqual(jasmine.any(Object));
          });

          it('calls getFirstAction with array', function() {
            expect(this.data.getFirstAction([], [])).toEqual(jasmine.any(Object));
          });

          it('calls getFirstAction with boolean - true', function() {
            expect(this.data.getFirstAction(true, true)).toEqual(jasmine.any(Object));
          });

          it('calls getFirstAction with boolean - false', function() {
            expect(this.data.getFirstAction(false, false)).toEqual(jasmine.any(Object))
          });

          it('calls getFirstAction with null', function() {
            expect(this.data.getFirstAction(null, null)).toEqual(jasmine.any(Object))
          });

          it('calls getFirstAction with number', function() {
            expect(this.data.getFirstAction(1, 2)).toEqual(jasmine.any(Object))
          });

          it('calls getFirstAction with object', function() {
            expect(this.data.getFirstAction({}, {})).toEqual(jasmine.any(Object))
          });

          it('calls getFirstAction with undefined', function() {
            expect(this.data.getFirstAction(undefined, undefined)).toEqual(jasmine.any(Object))
          });
        });
      });
    });

    describe('with valid homepage response', function() {
      describe('listActions', function() {
        it('should have 18 links', function() {
          expect(Object.keys(this.data.listActions().links).length).toEqual(18);
        });

        it('should have 13 forms', function() {
          expect(Object.keys(this.data.listActions().forms).length).toEqual(13);
        });
      });

      describe('handling of links', function() {
        beforeEach(function() {
          this.params = {};
        });

        describe('link action api', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('test:curie-test');
          });

          it('should have fetch api', function() {
            expect(this.link.fetch).toBeDefined();
          });

          it('should have getActionUrl api', function() {
            expect(this.link.getActionUrl).toBeDefined();
          });

          it('should have getRawActionUrl api', function() {
            expect(this.link.getRawActionUrl).toBeDefined();
          });

          it('should have getActionType api', function() {
            expect(this.link.getActionType).toBeDefined();
          });

          it('should return action type of "link"', function() {
            expect(this.link.getActionType()).toEqual('link');
          });

          it('should have getTitle api', function() {
            expect(this.link.getTitle).toBeDefined();
          });

          it('should have getActionName api', function() {
            expect(this.link.getActionName).toBeDefined();
          });

          it('should have getParams api', function() {
            expect(this.link.getParams).toBeDefined();
          });

          it('should have isTemplated api', function() {
            expect(this.link.isTemplated).toBeDefined();
          });

          it('should have setParams api', function() {
            expect(this.link.setParams).toBeDefined();
          });

          it('should have getDocUrl api', function() {
            expect(this.link.getDocUrl).toBeDefined();
          });

          it('should not have getFields api', function() {
            expect(this.link.getFields).not.toBeDefined();
          });

          it('should not have getPayload api', function() {
            expect(this.link.getPayload).not.toBeDefined();
          });
        });

        describe('test link with no title', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('noTitle');
          });

          it('getActionName', function() {
            expect(this.link.getActionName()).toBe('noTitle');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/no/title');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('no/title');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with no href', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('noHref');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('No href, just title');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with no params', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('noParams');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/no/params/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('no/params/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Link with no params');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with no params, templated false', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('noParamsNotTemplated');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/no/params/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('no/params/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Link with no params, templated false');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with no params, templated true', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('noParamsTemplated');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/no/params/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('no/params/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Link with no params, templated true');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with one param in path', function() {
          beforeEach(function() {
            this.params = {
              path: 'path'
            };

            this.link = this.data.getFirstAction('oneParamPath', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/one/param/path/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('one/param/{path}/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('One param in path');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with one param in query', function() {
          beforeEach(function() {
            this.params = {
              query: 'query'
            };

            this.link = this.data.getFirstAction('oneParamQuery', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/one/param/?query=query');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('one/param/{?query}');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('One param in query');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });

          describe('when query param is a boolean false', function() {
            beforeEach(function() {
              this.params = {
                query: false
              };

              this.link = this.data.getFirstAction('oneParamQuery', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/one/param/?query=false');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('one/param/{?query}');
            });

            it('getTitle', function() {
              expect(this.link.getTitle()).toEqual('One param in query');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(true);
            });
          });

          describe('when query param is undefined', function() {
            beforeEach(function() {
              this.params = {
                query: undefined
              };

              this.link = this.data.getFirstAction('oneParamQuery', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/one/param/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('one/param/{?query}');
            });

            it('getTitle', function() {
              expect(this.link.getTitle()).toEqual('One param in query');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(true);
            });
          });

          describe('when query param is null', function() {
            beforeEach(function() {
              this.params = {
                query: null
              };

              this.link = this.data.getFirstAction('oneParamQuery', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/one/param/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('one/param/{?query}');
            });

            it('getTitle', function() {
              expect(this.link.getTitle()).toEqual('One param in query');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(true);
            });
          });
        });

        describe('test link with two params, path and query', function() {
          beforeEach(function() {
            this.params = {
              path: 'path',
              query: 'query'
            };

            this.link = this.data.getFirstAction('twoParamsMixed', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/two/params/path/?query=query');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('two/params/{path}/{?query}');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Two params, one in path, one in query');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with two path params', function() {
          beforeEach(function() {
            this.params = {
              path1: 'path1',
              path2: 'path2'
            };

            this.link = this.data.getFirstAction('twoParamsPath', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/two/params/path1/path2/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('two/params/{path1}/{path2}/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Two params in path');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with two query params and hard coded param', function() {
          beforeEach(function() {
            this.params = {
              query1: 'query1',
              query2: 'query2'
            };

            this.link = this.data.getFirstAction('twoParamsQueryAndExisting', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/two/params/?test=1&query1=query1&query2=query2');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('two/params/?test=1{&query1,query2}');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Two params in query with hard coded param');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with two wrongly formatted query params and hard coded param', function() {
          beforeEach(function() {
            this.params = {
              query1: 'query1',
              query2: 'query2'
            };

            this.link = this.data.getFirstAction('twoParamsQueryInvalidAndExisting', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/two/params/?test=1&query1=query1&query2=query2');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('two/params/?test=1{?query1,query2}');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Two wrongly formatted params in query with hard coded param');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(true);
          });
        });

        describe('test link with root relative url', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('rootRelativeUrl', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/root/relative/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('/root/relative/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Root relative url');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with path relative url', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('pathRelativeUrl', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/root/relative/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('../root/relative/');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Path relative url');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link with absolute url', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('absoluteUrl', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('http://www.example.com');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('http://www.example.com');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Absolute url');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });

        describe('test link which has array of links', function() {
          beforeEach(function() {
            this.link = this.data.getAction('linkList', this.params);
          });

          it('should return an array of links', function() {
            expect(this.link).toEqual(jasmine.any(Array));
          });

          it('should have 2 links', function() {
            expect(this.link.length).toEqual(2);
          });

          it('should have getFirstAction equal to first link', function() {
            expect(this.data.getFirstAction('linkList', this.params)).toBe(this.link[0]);
          });

          describe('test first link', function() {
            it('getRawActionUrl', function() {
              expect(this.link[0].getRawActionUrl()).toBe('first/link');
            });

            it('getTitle', function() {
              expect(this.link[0].getTitle()).toEqual('first link');
            });
          });

          describe('test second link', function() {
            it('getRawActionUrl', function() {
              expect(this.link[1].getRawActionUrl()).toBe('second/link');
            });

            it('getTitle', function() {
              expect(this.link[1].getTitle()).toEqual('second link');
            });
          });
        });

        describe('test calling link twice with different params', function() {
          beforeEach(function() {
            this.params = {
              query1: 'query1',
              query2: 'query2'
            };

            this.link = this.data.getFirstAction('twoParamsQuery', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/two/params/?query1=query1&query2=query2');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          describe('second call', function() {
            beforeEach(function() {
              this.params = {
                query1: 'query2',
                query2: 'query1'
              };

              this.link = this.data.getFirstAction('twoParamsQuery', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/two/params/?query1=query2&query2=query1');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });
          });
        });

        describe('test link with curie url', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('test:curie-test', this.params);
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('http://www.example.com/curie/test/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('/curie/test/');
          });

          it('getDocUrl', function() {
            expect(this.link.getDocUrl()).toBe('http://www.example.com/docs/curie-test');
          });

          it('getTitle', function() {
            expect(this.link.getTitle()).toEqual('Curie test link');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });
        });
      });

      describe('handling of forms', function() {
        beforeEach(function() {
          this.params = {};
          this.fields = {};
          this.payload = '';
        });

        describe('form action api', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('formNoMethod');
          });

          it('should have fetch api', function() {
            expect(this.link.fetch).toBeDefined();
          });

          it('should have getActionUrl api', function() {
            expect(this.link.getActionUrl).toBeDefined();
          });

          it('should have getRawActionUrl api', function() {
            expect(this.link.getRawActionUrl).toBeDefined();
          });

          it('should have getActionType api', function() {
            expect(this.link.getActionType).toBeDefined();
          });

          it('should return action type of "form"', function() {
            expect(this.link.getActionType()).toEqual('form');
          });

          it('should have getTitle api', function() {
            expect(this.link.getTitle).toBeDefined();
          });

          it('should have getParams api', function() {
            expect(this.link.getParams).toBeDefined();
          });

          it('should have isTemplated api', function() {
            expect(this.link.isTemplated).toBeDefined();
          });

          it('should have setParams api', function() {
            expect(this.link.setParams).toBeDefined();
          });

          it('should have getFields api', function() {
            expect(this.link.getFields).toBeDefined();
          });

          it('should have getPayload api', function() {
            expect(this.link.getPayload).toBeDefined();
          });
        });

        describe('test form with no method', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('formNoMethod');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('/endpoint/form/');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('form/');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });

          it('getMethod', function() {
            expect(this.link.getMethod()).toEqual('POST');
          });

          it('getFields', function() {
            expect(this.link.getFields()).toEqual(this.fields);
          });

          it('getPayload', function() {
            expect(this.link.getPayload()).toEqual(this.payload);
          });
        });

        describe('test form with no action', function() {
          beforeEach(function() {
            this.link = this.data.getFirstAction('formNoAction');
          });

          it('getActionUrl', function() {
            expect(this.link.getActionUrl()).toBe('');
          });

          it('getRawActionUrl', function() {
            expect(this.link.getRawActionUrl()).toBe('');
          });

          it('getActionType', function() {
            expect(this.link.getActionType()).toEqual('form');
          });

          it('getParams', function() {
            expect(this.link.getParams()).toEqual(Object.keys(this.params));
          });

          it('isTemplated', function() {
            expect(this.link.isTemplated()).toEqual(false);
          });

          it('getMethod', function() {
            expect(this.link.getMethod()).toEqual('POST');
          });

          it('getFields', function() {
            expect(this.link.getFields()).toEqual(this.fields);
          });

          it('getPayload', function() {
            expect(this.link.getPayload()).toEqual(this.payload);
          });
        });

        describe('forms with method GET', function() {
          describe('test get form with no fields', function() {
            beforeEach(function() {
              this.link = this.data.getFirstAction('formGetNoFields');
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getActionType', function() {
              expect(this.link.getActionType()).toEqual('form');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('GET');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test get form with empty fields', function() {
            beforeEach(function() {
              this.link = this.data.getFirstAction('formGetEmptyFields');
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('GET');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test get form with one field', function() {
            beforeEach(function() {
              this.params = {
                param: 1
              };
              this.fields = {
                param: {}
              };
              this.link = this.data.getFirstAction('formGetOneField', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/?param=1');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('GET');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test get form with one field, empty payload', function() {
            beforeEach(function() {
              this.fields = {
                param: {}
              };

              this.link = this.data.getFirstAction('formGetOneField');
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('GET');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });
        });

        describe('forms with method POST', function() {
          describe('test post form with no fields', function() {
            beforeEach(function() {
              this.link = this.data.getFirstAction('formPostNoFields');
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getActionType', function() {
              expect(this.link.getActionType()).toEqual('form');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test get form with empty fields', function() {
            beforeEach(function() {
              this.link = this.data.getFirstAction('formPostEmptyFields');
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(Object.keys(this.params));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test post form with empty fields sending params', function() {
            beforeEach(function() {
              this.params = {
                param1: 1,
                param2: 2
              };

              this.link = this.data.getFirstAction('formPostNoFields', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(JSON.stringify(this.params));
            });
          });

          describe('test post form with two field', function() {
            beforeEach(function() {
              this.params = {
                param1: 1,
                param2: 2
              };
              this.fields = {
                param1: {},
                param2: {}
              };

              this.link = this.data.getFirstAction('formPostTwoFields', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.params);
            });
          });

          describe('test post form with two field, default value', function() {
            beforeEach(function() {
              this.params = {
                param2: 2
              };
              this.payload = {
                param1: 'test',
                param2: 2
              };
              this.fields = {
                param1: {
                  'default': 'test'
                },
                param2: {}
              };

              this.link = this.data.getFirstAction('formPostTwoFieldsDefaultValue', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test form with templated action', function() {
            beforeEach(function() {
              this.params = ['param'];
              this.payload = {
                param1: 1,
                param2: 2
              };
              this.fields = {
                param1: {},
                param2: {}
              };

              this.link = this.data.getFirstAction('formPostWithTemplatedAction', {
                param: 'param',
                param1: 1,
                param2: 2
              });
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/param/test');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/{param}/test');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(true);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual(this.payload);
            });
          });

          describe('test form with one field and wrong param', function() {
            beforeEach(function() {
              this.params = {
                wrong: 1
              };
              this.fields = {
                param: {}
              };
              this.link = this.data.getFirstAction('formPostOneField', this.params);
            });

            it('getActionUrl', function() {
              expect(this.link.getActionUrl()).toBe('/endpoint/form/');
            });

            it('getRawActionUrl', function() {
              expect(this.link.getRawActionUrl()).toBe('form/');
            });

            it('getParams', function() {
              expect(this.link.getParams()).toEqual(jasmine.any(Array));
            });

            it('isTemplated', function() {
              expect(this.link.isTemplated()).toEqual(false);
            });

            it('getMethod', function() {
              expect(this.link.getMethod()).toEqual('POST');
            });

            it('getFields', function() {
              expect(this.link.getFields()).toEqual(this.fields);
            });

            it('getPayload', function() {
              expect(this.link.getPayload()).toEqual({});
            });
          });
        });
      });
    });

    describe('with empty homepage response', function() {
      beforeEach(function(done) {
        window.fetch.and.returnValue(this.homepageData({}));
        this.testHyperGard = new HyperGard(testEndpoint, testOptions);
        this.testHyperGard.fetch().then(this.onSuccess, this.onError).then(done, done);
      });

      describe('getAction', function() {
        it('should have 0 actions', function() {
          expect(this.data.getAction('noLink').length).toEqual(0);
        });
      });

      describe('getFirstAction', function() {
        it('should return an action', function() {
          expect(this.data.getFirstAction('noLink')).toEqual(jasmine.any(Object));
        });
      });

      describe('listActions', function() {
        it('should have 0 links', function() {
          expect(Object.keys(this.data.listActions().links).length).toEqual(0);
        });

        it('should have 0 forms', function() {
          expect(Object.keys(this.data.listActions().forms).length).toEqual(0);
        });
      });
    });
  });
});
