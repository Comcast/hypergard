/**
 * Copyright 2018 Comcast Cable Communications Management, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or   implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import deepExtend from '../lib/extend.js';
import urltemplate from '../lib/urltemplate.js';
import urlparse from '../lib/urlparse.js';

var
  version = '4.0.0',

  defaultOptions = {
    preloadHomepage: true,
    cacheHomepage: false,
    debug: false,

    xhr: {
      headers: {
        Accept: 'application/hal+json, application/json, */*; q=0.01',
        'X-HyperGard': version
      }
    }
  },

  excludedProps = /^(_embedded|_links|_forms)$/,
  excludeBody = /^(head|get)$/i,
  concat = [].concat,
  keys = Object.keys,

  isObject = function(value) {
    return !!value && {}.toString.call(value) === '[object Object]';
  },

  xhrStatus = function(response) {
    return (response.status >= 200 && response.status < 300) ? response :
      Promise.reject(response instanceof Response ? response : new Response('', {
        status: 503,
        statusText: 'Possible CORS error'
      }));
  },

  xhrTimeout = function(timeout) {
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
  },

  load = function(url, fetchOptions) {
    var o = deepExtend({}, defaultOptions.xhr, fetchOptions);

    return Promise.race([
        xhrTimeout(fetchOptions.timeout || 60000),
        fetch(url, o)
      ]).then(xhrStatus);
  },

  urlSerialize = function(obj) {
    return Object.keys(obj).map(function(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');
  },

  HyperGard = function(endpoint, initOptions) {
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
          method: this.getMethod(),
          action: name,
        }, options.xhr, fetchOptions),

        onSuccess = function(response) {
          if (response.status === 204) {
            return Promise.resolve({
              action: name,
              data: '',
              xhr: response
            });
          }

          /**
           * If flag to returnRawData is false & the object is a valid
           * use Resource constructor
           * @param {} data
           */
          function formatData(data) {
            if (!o.returnRawData && isObject(data)) {
              return new Resource(url, data);
            }

            return data;
          }

          return response.json().then(function(data) {
            return {
              action: name,
              data: formatData(data),
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
      var o = deepExtend({
        method: 'GET',
        action: 'homepage',
      }, options.xhr);
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
        homepage = load(endpoint, o).then(onSuccess, onError);
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


export default HyperGard;

