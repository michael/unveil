// Unveil.js
// =============================================================================

var uv = {};

// Constants
// -----------------------------------------------------------------------------

uv.EPSILON     = 0.0001;
uv.MAX_FLOAT   = 3.4028235e+38;
uv.MIN_FLOAT   = -3.4028235e+38;
uv.MAX_INT     = 2147483647;
uv.MIN_INT     = -2147483648;

// Utilities
// -----------------------------------------------------------------------------

uv.inherit = function (f) {
  function G() {}
  G.prototype = f.prototype || f;
  return new G();
};

uv.each = function(obj, iterator, context) {
  if (obj.forEach) {
    obj.forEach(iterator, context);
  } else {
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
    }
  }
  return obj;
};

uv.rest = function(array, index, guard) {
  return Array.prototype.slice.call(array, (index === undefined || guard) ? 1 : index);
};

uv.include = function(arr, target) {
  return arr.indexOf(target) != -1;
};

uv.isArray = function(obj) {
  return toString.call(obj) === '[object Array]';
};

uv.select = uv.filter = function(obj, iterator, context) {
  if (obj.filter === Array.prototype.filter)
    return obj.filter(iterator, context);
  var results = [];
  uv.each(obj, function(value, index, list) {
    iterator.call(context, value, index, list) && results.push(value);
  });
  return results;
};

uv.extend = function(obj) {
  uv.rest(arguments).forEach(function(source) {
    for (var prop in source) obj[prop] = source[prop];
  });
  return obj;
};