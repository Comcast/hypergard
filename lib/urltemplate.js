
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

export default new UrlTemplate();
