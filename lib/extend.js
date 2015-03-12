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

export default deepExtend;

