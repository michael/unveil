// Top level namespace
var uv = {};

// Constants
uv.EPSILON = 0.0001;
uv.MAX_FLOAT   = 3.4028235e+38;
uv.MIN_FLOAT   = -3.4028235e+38;
uv.MAX_INT     = 2147483647;
uv.MIN_INT     = -2147483648;

uv.extend = function (f) {
  function G() {}
  G.prototype = f.prototype || f;
  return new G();
};