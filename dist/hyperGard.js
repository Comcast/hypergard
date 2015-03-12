(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('HyperGard', factory) :
	(global.HyperGard = factory());
}(this, (function () { 'use strict';

'use strict';

var typeObj = {};
var slice = [].slice;
var toString = typeObj.toString;

var getType = function(mixed) {
  if (mixed == null) {
    return mixed + '';
  }

  return typeof mixed === 'object' || typeof mixed === 'function' ?
            typeObj[toString.call(mixed)] || 'object' : typeof mixed;
};

var isSpecificValue = function(val) {
  return getType(val) === 'buffer' || getType(val) === 'date' || getType(val) === 'regexp';
};

var cloneSpecificValue = function(val) {
  var valType = getType(val);
  var x;

  if (valType === 'buffer') {
    x = new Buffer(val.length);
    val.copy(x);
    return x;
  }

  if (valType === 'date') {
    return new Date(val.getTime());
  }

  if (valType === 'regexp') {
    return new RegExp(val);
  }

  throw new Error('Unexpected situation');
};

/**
 * Recursive cloning array.
 */
var deepCloneArray = function(arr) {
  var clone = [];

  arr.forEach(function(item, index) {
    if (getType(item) === 'object') {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });

  return clone;
};

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = function(/*obj_1, [obj_2], [obj_N]*/) {
  if (arguments.length < 1 || getType(arguments[0]) !== 'object') {
    return false;
  }

  if (arguments.length < 2) {
    return arguments[0];
  }

  var target = arguments[0];
  var args = slice.call(arguments, 1);
  var val, src;

  args.forEach(function(obj) {
    // skip argument if it is array or isn't object
    if (getType(obj) !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach(function(key) {
      src = target[key]; // source value
      val = obj[key]; // new value

      // recursion prevention
      if (val !== target) {
        if (getType(val) !== 'object' || val === null) {
          target[key] = val;
        } else if (Array.isArray(val)) {
          // just clone arrays (and recursive clone objects inside)
          target[key] = deepCloneArray(val);
        } else if (isSpecificValue(val)) {
          // custom cloning and overwrite for specific objects
          target[key] = cloneSpecificValue(val);
        } else if (getType(src) !== 'object' || src === null || Array.isArray(src)) {
          // overwrite by new value if source isn't object or array
          target[key] = deepExtend({}, val);
        } else {
          // source value and new value is objects both, extending...
          target[key] = deepExtend(src, val);
        }
      }
    });
  });

  return target;
};

['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'].forEach(function(name) {
  typeObj["[object " + name + "]"] = name.toLowerCase();
});

/**
 * @constructor
 */
function UrlTemplate() {
  var
    /**
     * Operators
     * @type {String[]}
     */
    operators = ['+', '#', '.', '/', ';', '?', '&'],

    parseTemplate = /\{([^\{\}]+)\}|([^\{\}]+)/g,
    parseVariable = /([^:\*]*)(?::(\d+)|(\*))?/,

    /**
     * @private
     * @param {string} str
     * @return {string}
     */
    encodeReserved = function(str) {
      return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
          part = encodeURI(part);
        }
        return part;
      }).join('');
    },

    /**
     * @private
     * @param {string} operator
     * @param {string} value
     * @param {string} key
     * @return {string}
     */
    encodeValue = function(operator, value, key) {
      value = (operator === '+' || operator === '#') ? encodeReserved(value) : encodeURIComponent(value);
      return key ? encodeURIComponent(key) + '=' + value : value;
    },

    /**
     * @private
     * @param {*} value
     * @return {boolean}
     */
    isDefined = function(value) {
      return value !== undefined && value !== null;
    },

    /**
     * @private
     * @param {string} operator
     * @return {boolean}
     */
    isKeyOperator = function(operator) {
      return operator === ';' || operator === '&' || operator === '?';
    },

    /**
     * @private
     * @param {Object} context
     * @param {string} operator
     * @param {string} key
     * @param {string} modifier
     */
    getValues = function(context, operator, key, modifier) {
      var
        value = context[key],
        result = [];

      if (typeof value !== 'undefined' && value !== null) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          value = value.toString();

          if (modifier && modifier !== '*') {
            value = value.substring(0, parseInt(modifier, 10));
          }

          result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
          if (modifier === '*') {
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value) {
                result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  result.push(encodeValue(operator, value[k], k));
                }
              });
            }
          } else {
            var tmp = [];

            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function(value) {
                tmp.push(encodeValue(operator, value, ''));
              });
            } else {
              Object.keys(value).forEach(function(k) {
                if (isDefined(value[k])) {
                  tmp.push(encodeURIComponent(k));
                  tmp.push(encodeValue(operator, value[k].toString(), ''));
                }
              });
            }

            if (isKeyOperator(operator)) {
              result.push(encodeURIComponent(key) + '=' + tmp.join(','));
            } else if (tmp.length !== 0) {
              result.push(tmp.join(','));
            }
          }
        }
      } else {
        if (operator === ';') {
          result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
          result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
          result.push('');
        }
      }

      return result;
    };

  /**
   * @param {String} url
   * @param {Object} params to be applied
   * @return {string}
   */
  this.expand = function(url, params) {
    return url.replace(parseTemplate, function(_, expression, literal) {
      var
        result;

      if (expression) {
        var
          operator,
          values = [];

        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);

          if ((url.match(/\?/g) || []).length > 1) {
            operator = '&';
          }
        }

        expression.split(/,/g).forEach(function(variable) {
          var tmp = parseVariable.exec(variable);
          values.push.apply(values, getValues(params, operator, tmp[1], tmp[2] || tmp[3]));
        });

        if (operator && operator !== '+') {
          var separator = ',';

          if (operator === '?') {
            separator = '&';
          } else if (operator !== '#') {
            separator = operator;
          }

          result = (values.length ? operator : '') + values.join(separator);
        } else {
          result = values.join(',');
        }
      } else {
        result = encodeReserved(literal);
      }

      return result;
    });
  };

  this.extractParams = function(url) {
    var
      result = [];

    url.replace(parseTemplate, function(_, expression) {
      if (expression) {
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          expression = expression.substr(1);
        }
        result = result.concat(expression.split(/,/g));
      }
    });

    return result;
  };
}

var urltemplate = new UrlTemplate();

/**
 * @constructor
 */
function UrlParse() {
  var
  // scheme (optional), host, port
    fullurl = /^([A-Za-z]+)?(:?\/\/)([0-9.\-A-Za-z]*)(?::(\d+))?(.*)$/,
  // path, query, fragment
    parse_leftovers = /([^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;

  // Unlike to be useful standalone
  //
  // NORMALIZE PATH with "../" and "./"
  //   http://en.wikipedia.org/wiki/URL_normalization
  //   http://tools.ietf.org/html/rfc3986#section-5.2.3
  //
  this.normalizepath = function(path) {
    if (!path || path === '/') {
      return '/';
    }

    var
      parts = path.split('/'),
      newparts = [];

    // make sure path always starts with '/'
    if (parts[0]) {
      newparts.push('');
    }

    parts.forEach(function(part) {
      if (part === '..') {
        if (newparts.length > 1) {
          newparts.pop();
        } else {
          newparts.push(part);
        }
      } else if (part !== '.') {
        newparts.push(part);
      }
    });

    return newparts.join('/') || '/';
  };

  //
  // Does many of the normalizations that the stock
  //  python urlsplit/urlunsplit/urljoin neglects
  //
  // Doesn't do hex-escape normalization on path or query
  //   %7e -> %7E
  // Nor, '+' <--> %20 translation
  //
  this.urlnormalize = function(url) {
    var parts = this.urlsplit(url);

    switch (parts.scheme) {
      case 'file':
        // files can't have query strings
        //  and we don't bother with fragments
        parts.query = '';
        parts.fragment = '';
        break;
      case 'http':
      case 'https':
        // remove default port
        if ((parts.scheme === 'http' && parts.port == 80) ||
          (parts.scheme === 'https' && parts.port == 443)) {
          delete parts.port;
          // hostname is already lower case
          parts.netloc = parts.hostname;
        }
        break;
      default:
        // if we don't have specific normalizations for this
        // scheme, return the original url unmolested
        return url;
    }

    // for [file|http|https].  Not sure about other schemes
    parts.path = this.normalizepath(parts.path);

    return this.urlunsplit(parts);
  };

  this.urldefrag = function(url) {
    var idx = url.indexOf('#');
    return (idx === -1) ? [url, ''] : [url.substr(0, idx), url.substr(idx + 1)];
  };

  this.urlsplit = function(url, default_scheme, allow_fragments) {
    allow_fragments = allow_fragments !== false;

    var
      leftover,
      o = {},
      parts = (url || '').match(fullurl);

    if (parts) {
      o.scheme = parts[1] || default_scheme || '';
      o.hostname = parts[3].toLowerCase() || '';
      o.port = parseInt(parts[4], 10) || '';
      // Probably should grab the netloc from regexp
      //  and then parse again for hostname/port

      o.netloc = parts[3];

      if (parts[4]) {
        o.netloc += ':' + parts[4];
      }

      leftover = parts[5];
    } else {
      o.scheme = default_scheme || '';
      o.netloc = '';
      o.hostname = '';
      leftover = url;
    }
    o.scheme = o.scheme.toLowerCase();

    parts = leftover.match(parse_leftovers);

    o.path = parts[1] || '';
    o.query = parts[2] || '';

    o.fragment = allow_fragments ? (parts[3] || '') : '';

    return o;
  };

  this.urlunsplit = function(o) {
    var s = '';

    if (o.scheme) {
      s += o.scheme + '://';
    }

    if (o.netloc) {
      if (s === '') {
        s += '//';
      }

      s += o.netloc;
    } else if (o.hostname) {
      // extension.  Python only uses netloc
      if (s === '') {
        s += '//';
      }

      s += o.hostname;

      if (o.port) {
        s += ':' + o.port;
      }
    }

    if (o.path) {
      s += o.path;
    }

    if (o.query) {
      s += '?' + o.query;
    }

    if (o.fragment) {
      s += '#' + o.fragment;
    }

    return s;
  };

  this.urljoin = function(base, url, allow_fragments) {
    if (typeof allow_fragments === 'undefined') {
      allow_fragments = true;
    }

    var url_parts = this.urlsplit(url);

    // if url parts has a scheme (i.e. absolute)
    // then nothing to do
    if (url_parts.scheme) {
      return !allow_fragments ? url : this.urldefrag(url)[0];
    }

    var base_parts = this.urlsplit(base);

    // copy base, only if not present
    if (!base_parts.scheme) {
      base_parts.scheme = url_parts.scheme;
    }

    // copy netloc, only if not present
    if (!base_parts.netloc || !base_parts.hostname) {
      base_parts.netloc = url_parts.netloc;
      base_parts.hostname = url_parts.hostname;
      base_parts.port = url_parts.port;
    }

    // paths
    if (url_parts.path.length > 0) {
      if (url_parts.path.charAt(0) === '/') {
        base_parts.path = url_parts.path;
      } else {
        // relative path.. get rid of "current filename" and
        //   replace.  Same as var parts =
        //   base_parts.path.split('/'); parts[parts.length-1] =
        //   url_parts.path; base_parts.path = parts.join('/');
        var idx = base_parts.path.lastIndexOf('/');
        if (idx === -1) {
          base_parts.path = url_parts.path;
        } else {
          base_parts.path = base_parts.path.substr(0, idx) + '/' +
            url_parts.path;
        }
      }
    }

    // clean up path
    base_parts.path = this.normalizepath(base_parts.path);

    // copy query string
    base_parts.query = url_parts.query;

    // copy fragments
    base_parts.fragment = allow_fragments ? url_parts.fragment : '';

    return this.urlunsplit(base_parts);
  };
}

var urlparse = new UrlParse();

/**
 * @author Paul.Bronshteyn
 * @comment Built by a geek loaded on caffeine ...
 */
'use strict';

var version = '4.0.0';
var defaultOptions = {
    preloadHomepage: true,
    cacheHomepage: false,
    debug: false,

    xhr: {
      headers: {
        Accept: 'application/hal+json, application/json, */*; q=0.01',
        'X-HyperGard': version
      }
    }
  };
var excludedProps = /^(_embedded|_links|_forms)$/;
var excludeBody = /^(head|get)$/i;
var concat = [].concat;
var keys = Object.keys;
var isObject = function(value) {
    return !!value && {}.toString.call(value) === '[object Object]';
  };
var xhrStatus = function(response) {
    return (response.status >= 200 && response.status < 300) ? response :
      Promise.reject(response instanceof Response ? response : new Response('', {
        status: 503,
        statusText: 'Possible CORS error'
      }));
  };
var xhrTimeout = function(timeout) {
    return new Promise(function(res, rej) {
      setTimeout(function() {
        rej({
          error: {
            code: '0011',
            msg: 'Fetch timeout',
            timeout: timeout
          }
        });
      }, timeout);
    });
  };
var load = function(url, fetchOptions) {
    var o = deepExtend({}, defaultOptions.xhr, fetchOptions);

    return Promise.race([
        xhrTimeout(fetchOptions.timeout || 60000),
        fetch(url, o)
      ]).then(xhrStatus);
  };
var urlSerialize = function(obj) {
    return Object.keys(obj).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
  };
var HyperGard = function(endpoint, initOptions) {
    var
      homepage,
      homepageLoaded = false,
      options = deepExtend({}, defaultOptions, initOptions || {}),
      linkRefs = {},

      parseCuries = function(curies) {
        var result = {};

        (curies || []).forEach(function(curie) {
          if (curie.name) {
            result[curie.name] = curie;
          }
        });

        return result;
      },

      parseEmbedded = function(res, parent) {
        var
          result = {};

        keys(res).forEach(function(key) {
          result[key] = Array.isArray(res[key]) ? res[key].map(function(item) {
            return new EmbeddedResource(item, parent);
          }) : new EmbeddedResource(res[key], parent);
        });

        return result;
      },

      sharedResourceAPI = function(obj, res, parent, base) {
        var
          props = {},
          link = ((res._links || {}).self || {}).href || '',
          actions = [],
          embedded = parseEmbedded(res._embedded || {}, obj);

        keys(res).forEach(function(key) {
          if (!excludedProps.test(key)) {
            this[key] = res[key];
          }
        }, props);

        /**
         * Get Action
         * @description Allow to follow actions (links, forms) on HAL resources and embedded resources
         * @param {String} name The name of the action to be taken
         * @param {Object} params Parameters to populate the action
         * @returns {Array} List of available actions
         */
        obj.getAction = function(name, params) {
          if (!actions[name]) {
            actions[name] = [];

            var
              linkCuries = parseCuries((res._links || {}).curies),
              formCuries = parseCuries((res._forms || {}).curies),
              curieName = String(name).split(':')[0] || '';

            concat.call([], (res._links || {})[name]).forEach(function(lnk) {
              if (lnk) {
                lnk.curie = linkCuries[curieName];
                actions[name].push(new Action(this, name, lnk, params, 'link'));
              }
            }, this);

            concat.call([], (res._forms || {})[name]).forEach(function(frm) {
              if (frm) {
                frm.curie = formCuries[curieName];
                actions[name].push(new Action(this, name, frm, params, 'form'));
              }
            }, this);
          }

          return actions[name].map(function(action) {
            return action.setParams(params);
          });
        };

        /**
         * Get base api path
         * @returns {String}
         */
        obj.getBase = function() {
          return base || parent.getBase();
        };

        /**
         * Get embedded object
         * @param {String} name Name of the embedded object
         * @returns {Object}
         */
        obj.getEmbedded = function(name) {
          return embedded[name];
        };

        /**
         * Fetch embedded
         * @description Get the object from embedded or follow a link with the same name
         * @param {String} name Name of the embedded object
         * @param {Object} [options] to provide to fetch for actions
         * @returns {Promise}
         */
        obj.fetchEmbedded = function(name, options) {
          return this.hasEmbedded(name) ? Promise.resolve({
            data: this.getEmbedded(name)
          }) : this.getFirstAction(name).fetch(options);
        };

        /**
         * Get first action from getAction list
         * @description Convenience method to get the first action instead of using getAction()[0]
         * @param {String} name The name of the action to be taken
         * @param {Object} params Parameters to populate the action
         * @returns {Object} Get Action API
         */
        obj.getFirstAction = function(name, params) {
          return this.getAction(name, params)[0] || new Action(this, name, {}, {}, 'none');
        };

        /**
         * Get parent resource object
         * @returns {Object}
         */
        obj.getParent = function() {
          return parent;
        };

        /**
         * Get property value
         * @returns {*}
         */
        obj.getProp = function(prop) {
          return props[prop];
        };

        /**
         * Get all properties as an object
         * @returns {Object}
         */
        obj.getProps = function() {
          return props;
        };

        /**
         * Does an object have a given action?
         * @description Convenience method to find out if an object has a link or form
         * @param {String} name The name of the action
         * @returns {Boolean}
         */
        obj.hasAction = function(name) {
          return obj.hasLink(name) || obj.hasForm(name);
        };

        /**
         * Does a resource contain a given embedded obj?
         * @description Convenience method to find out if a resource contains an embedded object
         * @param {String} name The name of the embedded obj
         * @returns {Boolean}
         */
        obj.hasEmbedded = function(name) {
          return !!embedded[name];
        };

        /**
         * Does an object have a given form?
         * @description Convenience method to find out if an object has a form
         * @param {String} name The name of the form
         * @returns {Boolean}
         */
        obj.hasForm = function(name) {
          return obj.listActions().forms.indexOf(name) >= 0;
        };

        /**
         * Does an object have a given link?
         * @description Convenience method to find out if an object has a link
         * @param {String} name The name of the link
         * @returns {Boolean}
         */
        obj.hasLink = function(name) {
          return obj.listActions().links.indexOf(name) >= 0;
        };

        /**
         * List of all available actions
         * @returns {Object}
         */
        obj.listActions = function() {
          var
            filter = function(item) {
              return item !== 'curies';
            };

          return {
            links: keys(res._links || {}).filter(filter),
            forms: keys(res._forms || {}).filter(filter)
          };
        };

        /**
         * List of all available embedded objects
         * @returns {Array}
         */
        obj.listEmbedded = function() {
          return keys(embedded);
        };


        if (options.debug) {
          /**
           * original HAL resource
           */
          obj.resource = res;
        }

        if (!base) {
          /**
           * Get root level resource
           */
          obj.getRoot = function() {
            var root;

            do {
              root =  this.getParent();
            } while (!(root instanceof Resource));

            return root;
          };
        }

        if (link) {
          linkRefs[link] = obj;
        }
      },

      /**
       * Action instance
       * @param {Object} parent Parent resource
       * @param {String} name Action name
       * @param {Object} action Action object
       * @param {Object} [params] Params to be used for templated action
       * @param {String} type Internal identification of action type
       * @constructor
       */
      Action = function(parent, name, action, params, type) {
        var
          api = this,
          rawUrl = (action.href || action.action || '').replace(/^#/, ''),
          method = action.method || (type === 'form' ? 'POST' : 'GET'),
          actionUrl = '',
          payLoad = '';

        /**
         * Get action name
         * @returns {String}
         */
        api.getActionName = function() {
          return name;
        };

        /**
         * Get action type
         * @returns {String}
         */
        api.getActionType = function() {
          return type;
        };

        /**
         * Get formatted url for the action
         * @returns {String}
         */
        api.getActionUrl = function() {
          return actionUrl;
        };

        /**
         * Get action method
         * @returns {String}
         */
        api.getMethod = function() {
          return method;
        };

        /**
         * Get params that need are required for the action
         * @returns {Array}
         */
        api.getParams = function() {
          return urltemplate.extractParams(rawUrl);
        };

        /**
         * Get un-formatted url for the action
         * @returns {String}
         */
        api.getRawActionUrl = function() {
          return rawUrl;
        };

        /**
         * Get action title
         * @returns {String}
         */
        api.getTitle = function() {
          return action.title || '';
        };

        /**
         * Get action template flag
         * @returns {Boolean}
         */
        api.isTemplated = function() {
          return action.templated || false;
        };

        api.setParams = function(params) {
          actionUrl = action.templated ? urltemplate.expand(rawUrl, params || {}) : rawUrl;

          if (actionUrl) {
            actionUrl = urlparse.urljoin(action.curie ? action.curie.href : parent.getBase(), actionUrl);
          }

          if (type === 'form') {
            if (action.fields && isObject(params)) {
              payLoad = {};
              keys(action.fields).forEach(function(field) {
                if (params.hasOwnProperty(field)) {
                  payLoad[field] = params[field];
                } else if (action.fields[field].hasOwnProperty('default')) {
                  payLoad[field] = action.fields[field]['default'];
                }
              });
            } else if (params) {
              payLoad = JSON.stringify(params);
            }

            if (excludeBody.test(method) && payLoad) {
              actionUrl = urlparse.urljoin(actionUrl, '?' + urlSerialize(payLoad));
              payLoad = '';
            }
          }

          return api;
        };

        if (type === 'form') {
          /**
           * Get form fields for the form action
           * @returns {Object}
           */
          api.getFields = function() {
            return action.fields || {};
          };

          /**
           * Get payload to be submitted for the form action
           * @returns {Object}
           */
          api.getPayload = function() {
            return payLoad;
          };
        }

        if (action.curie) {
          /**
           * Get curie documentation url
           * @returns {String}
           */
          api.getDocUrl = function() {
            return urltemplate.expand(action.curie.href, {
              rel: name.split(':')[1]
            });
          };
        }

        api.setParams(params);
      },

      /**
       * HAL Embedded resource
       * @param {Resource} res HAL resource
       * @param {Resource} parent Parent HAL resource
       * @constructor
       */
      EmbeddedResource = function(res, parent) {
        return sharedResourceAPI(this, res || {}, parent);
      },

      /**
       * HAL Resource
       * @param {String} base Base url for the resource
       * @param {Object} res Resource data
       * @constructor
       */
      Resource = function(base, res) {
        return sharedResourceAPI(this, res, this, base);
      };

    Action.prototype.fetch = function(fetchOptions) {
      fetchOptions || (fetchOptions = {});

      var
        url = fetchOptions.url || this.getActionUrl(),
        rawUrl = this.getRawActionUrl(),
        name = this.getActionName(),
        payLoad = this.getPayload ? this.getPayload() : '',
        o = deepExtend({
          method: this.getMethod()
        }, options.xhr, fetchOptions),

        onSuccess = function(response) {
          if (response.status === 204) {
            return Promise.resolve({
              action: name,
              data: '',
              xhr: response
            });
          }

          return response.json().then(function(data) {
            return {
              action: name,
              data: isObject(data) ? new Resource(url, data) : response.text(),
              xhr: response
            };
          }, function() {
            return {
              action: name,
              data: response.text(),
              xhr: response
            };
          });
        },

        onError = function(response) {
          return Promise.reject(response instanceof Response ? {
            error: {
              action: name,
              code: '0021',
              msg: 'Failed to retrieve action'
            },
            xhr: response
          } : response);
        };

      if (!excludeBody.test(o.method) && isObject(payLoad)) {
        o.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        o.body = urlSerialize(payLoad);
      }

      if (!url) {
        return Promise.reject({
          error: {
            action: name,
            code: '0020',
            msg: 'Url is not provided for this action'
          }
        });
      } else if (o.method === 'GET' && !fetchOptions.force && linkRefs.hasOwnProperty(rawUrl)) {
        return Promise.resolve({
          action: name,
          data: linkRefs[rawUrl]
        });
      }

      return load(url, o).then(onSuccess, onError);
    };

    /**
     * Fetch
     * @returns {Promise}
     */
    this.fetch = function() {
      var
        onSuccess = function(response) {
          if (!options.cacheHomepage) {
            homepageLoaded = false;
          }

          return response.json().then(function(data) {
            return isObject(data) ? {
              data: new Resource(endpoint, data),
              xhr: response
            } : Promise.reject();
          })['catch'](function() {
            return Promise.reject({
              error: {
                code: '0002',
                msg: 'Could not parse homepage'
              },
              xhr: response
            });
          });
        },

        onError = function(response) {
          homepageLoaded = false;

          return Promise.reject(response instanceof Response ? {
            error: {
              code: '0001',
              msg: 'Failed to retrieve homepage'
            },
            xhr: response
          } : response);
        };

      if (!endpoint) {
        return Promise.reject({
          error: {
            code: '0000',
            msg: 'API endpoint was not provided'
          }
        });
      }

      if (!homepageLoaded) {
        homepageLoaded = true;
        homepage = load(endpoint, options.xhr).then(onSuccess, onError);
      }

      return homepage;
    };

    /**
     * Set global options
     * @param {Object} o Options object
     * @return {Object} HyperGard
     */
    this.setOptions = function(o) {
      deepExtend(options, o || {});
      return this;
    };

    /**
     * Get global options
     * @returns {Object}
     */
    this.getOptions = function() {
      return options;
    };

    /**
     * Parse json into resource
     * @param {Object} json Data in json format to be parsed as resource
     * @returns {Resource}
     */
    this.parse = function(json) {
      return new Resource(endpoint, json || {});
    };

    /**
     * Fetch homepage on initialization
     */
    if (options.preloadHomepage) {
      this.fetch();
    }
  };

HyperGard.prototype.version = version;

/**
 * Will wrap any fetch performed in supplied middleware
 * This will allow custom logging headers to be set without
 * using before/after fetch events
 * @param {Function} middleware Function to wrap fetches in
 */
function applyMiddleware(middleware) {
  load = (function(stack) {
    return function(url, fetchOptions) {
      return middleware(url, fetchOptions, stack);
    };
  })(load);
}

/**
 * Will apply an array of middleware functions around the load method
 * @param {Array} middlewareStack Array of functions to be wrapped around every load
 */
HyperGard.prototype.applyMiddlewareStack = function(middlewareStack) {
  var applicationOrder;
  if (middlewareStack && Array.isArray(middlewareStack) && middlewareStack.length) {
    // Apply in reverse order, for first entry is applied as inner most wrapper
    applicationOrder = middlewareStack.reverse();
    applicationOrder.forEach(applyMiddleware);
  }
};

return HyperGard;

})));
