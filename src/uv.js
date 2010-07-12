// Top level namespace
var uv = {};


/**
* @private Returns a prototype object suitable for extending the given class
* <tt>f</tt>. Rather than constructing a new instance of <tt>f</tt> to serve as
* the prototype (which unnecessarily runs the constructor on the created
* prototype object, potentially polluting it), an anonymous function is
* generated internally that shares the same prototype:
*
* <pre>function g() {}
* g.prototype = f.prototype;
* return new g();</pre>
*
* For more details, see Douglas Crockford's essay on prototypal inheritance.
*
* @param {function} f a constructor.
* @returns a suitable prototype object.
* @see Douglas Crockford's essay on <a
* href="http://javascript.crockford.com/prototypal.html">prototypal
* inheritance</a>.
*/

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


// Usage:
// 
// ["a","b", "c"].eachItem(function(item, index) {
//   item
// });

if (!Array.prototype.eachItem) {
  Array.prototype.eachItem = function (f, o) {
    var n = this.length || 0,
        i;
    for (i = 0; i < n; i += 1) {
      if (i in this) {
        f.call(o, this[i], i, this);
      }
    }
  };
}

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




// Class - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Create a "class" with the given _proto_.
 *
 * Example:
 *
 *   var User = new Class({
 *     constructor: function(name){
 *       this.name = name
 *     },
 *     toString: function(){
 *       return '[User ' + this.name + ']'
 *     }
 *   })
 *
 *   var Admin = User.extend({
 *     extend: { isSuperPowerful: true },
 *     constructor: function(name) {
 *       User.call(this, name.toUpperCase())
 *     }
 *   })
 *
 *   puts(new Admin('tj'))
 *   // => "[User TJ]"
 *
 *   puts(Admin.isSuperPowerful)
 *   // => true
 *
 * @param  {object} proto
 * @return {function}
 * @api public
 */

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

/**
 * Include the given _proto_ object.
 *
 * @param  {object} proto
 * @return {Class}
 * @api public
 */

Class.prototype.include = function(proto){
  extend(this.prototype, proto)
  if ('included' in proto) proto.included(this)
  return this
}

/**
 * Extend object _a_ with _b_.
 *
 * @param  {object} a
 * @param  {object} b
 * @api public
 */

function extend(a, b) {
  for (var key in b)
    if (b.hasOwnProperty(key))
      a[key] = b[key]
}
