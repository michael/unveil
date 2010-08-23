// Vector (taken from Processing.js)
// =============================================================================

uv.Vector = function(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
};

uv.Vector.angleBetween = function(v1, v2) {
  return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
};

// Common vector operations for Vector
uv.Vector.prototype = {
  set: function(v, y, z) {
    if (arguments.length === 1) {
      this.set(v.x || v[0], v.y || v[1], v.z || v[2]);
    } else {
      this.x = v;
      this.y = y;
      this.z = z;
    }
  },
  get: function() {
    return new uv.Vector(this.x, this.y, this.z);
  },
  mag: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  },
  add: function(v, y, z) {
    if (arguments.length === 3) {
      this.x += v;
      this.y += y;
      this.z += z;
    } else if (arguments.length === 1) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    }
  },
  sub: function(v, y, z) {
    if (arguments.length === 3) {
      this.x -= v;
      this.y -= y;
      this.z -= z;
    } else if (arguments.length === 1) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    }
  },
  mult: function(v) {
    if (typeof v === 'number') {
      this.x *= v;
      this.y *= v;
      this.z *= v;
    } else if (typeof v === 'object') {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
    }
  },
  div: function(v) {
    if (typeof v === 'number') {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    } else if (typeof v === 'object') {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    }
  },
  dist: function(v) {
    var dx = this.x - v.x,
      dy = this.y - v.y,
      dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },
  dot: function(v, y, z) {
    var num;
    if (arguments.length === 3) {
      num = this.x * v + this.y * y + this.z * z;
    } else if (arguments.length === 1) {
      num = this.x * v.x + this.y * v.y + this.z * v.z;
    }
    return num;
  },
  cross: function(v) {
    var
    crossX = this.y * v.z - v.y * this.z,
      crossY = this.z * v.x - v.z * this.x,
      crossZ = this.x * v.y - v.x * this.y;
    return new uv.Vector(crossX, crossY, crossZ);
  },
  normalize: function() {
    var m = this.mag();
    if (m > 0) {
      this.div(m);
    }
  },
  limit: function(high) {
    if (this.mag() > high) {
      this.normalize();
      this.mult(high);
    }
  },
  heading2D: function() {
    var angle = Math.atan2(-this.y, this.x);
    return -angle;
  },
  toString: function() {
    return "[" + this.x + ", " + this.y + ", " + this.z + "]";
  },
  array: function() {
    return [this.x, this.y, this.z];
  }
};
