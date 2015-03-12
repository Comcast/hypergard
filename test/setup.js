if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = [].slice.call(arguments, 1),
      fToBind = this,
      fNOP = function() {
      },
      fBound = function() {
        return fToBind.apply(this instanceof fNOP
            ? this
            : oThis,
          aArgs.concat([].slice.call(arguments)));
      };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

var toString = {}.toString;

var testEndpoint = '/endpoint/';
var testOptions = {
  preloadHomepage: false,
  cacheHomepage: false,
  debug: true,

  xhr: {
    headers: {
      Authorization: 'auth'
    }
  }
};

beforeEach(function() {
  this.hyperGard = null;
  this.error = null;
  this.data = null;
  this.actionData = null;
  this.actionError = null;

  this.homepageData = function(responseData, status) {
    return new window.Response(JSON.stringify(responseData), {
      status: status || 200,
      headers: {
        'Content-type': 'application/hal+json'
      }
    });
  };

  this.onError = function(error) {
    this.error = error;
  }.bind(this);

  this.onSuccess = function(response) {
    this.data = response.data;
  }.bind(this);

  this.onActionError = function(error) {
    this.actionError = error;
  }.bind(this);

  this.onActionSuccess = function(response) {
    this.actionData = response.data;
  }.bind(this);

  spyOn(window, 'fetch');
  spyOn(this, 'onError').and.callThrough();
  spyOn(this, 'onSuccess').and.callThrough();
  spyOn(this, 'onActionError').and.callThrough();
  spyOn(this, 'onActionSuccess').and.callThrough();
});
