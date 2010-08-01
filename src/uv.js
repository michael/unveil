// Top level namespace
var uv = {};

// CONSTANTS
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


function Class(proto) {
  var self = this,
      isSubclass = typeof this === 'function',
      Class = proto.hasOwnProperty('constructor')
        ? proto.constructor
        : isSubclass 
          ? (proto.constructor = function(){ self.apply(this, arguments) })
          : (proto.constructor = function(){})
  if (proto.hasOwnProperty('extend'))
    extend(Class, proto.extend)
  Class.prototype = proto
  Class.extend = arguments.callee
  if (isSubclass) {
    Class.prototype.__proto__ = this.prototype
    if ('extended' in this)
      this.extended(Class)
  }
  return Class
}

Class.prototype = Function.prototype

Class.prototype.include = function(proto){
  extend(this.prototype, proto)
  if ('included' in proto) proto.included(this)
  return this
}

function extend(a, b) {
  for (var key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key]
}
