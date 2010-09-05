// Top level namespace
var uv = {};

// Constants
uv.EPSILON = 0.0001;
uv.MAX_FLOAT   = 3.4028235e+38;
uv.MIN_FLOAT   = -3.4028235e+38;
uv.MAX_INT     = 2147483647;
uv.MIN_INT     = -2147483648;
uv.PI          = Math.PI;
uv.TWO_PI      = 2 * uv.PI;
uv.HALF_PI     = uv.PI / 2;
uv.THIRD_PI    = uv.PI / 3;
uv.QUARTER_PI  = uv.PI / 4;
uv.DEG_TO_RAD  = uv.PI / 180;
uv.RAD_TO_DEG  = 180 / uv.PI;


Object.extend = function (f) {
  function G() {}
  G.prototype = f.prototype || f;
  return new G();
};


Object.create = function (o) {
  function F() {}
  F.prototype = o;
  return new F();
};


Object.keys = function (obj) {
  var array = [],
      prop;
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      array.push(prop);
    }
  }
  return array;
};

