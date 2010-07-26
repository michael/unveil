////////////////////////////////////////////////////////////////////////////
// 2D Matrix
// Taken from Processing.js
////////////////////////////////////////////////////////////////////////////

/* TODO: look for a more functional-style matrix implementation */
/* http://files.geomajas.org/doc/jsdoc/1.3.1/overview-summary-Matrix2D.js.html*/

/*
  Helper function for printMatrix(). Finds the largest scalar
  in the matrix, then number of digits left of the decimal.
  Called from Matrix2D's print() method.
*/

uv.printMatrixHelper = function printMatrixHelper(elements) {
  var big = 0;
  for (var i = 0; i < elements.length; i++) {

    if (i !== 0) {
      big = Math.max(big, Math.abs(elements[i]));
    } else {
      big = Math.abs(elements[i]);
    }
  }

  var digits = (big + " ").indexOf(".");
  if (digits === 0) {
    digits = 1;
  } else if (digits === -1) {
    digits = (big + " ").length;
  }

  return digits;
};

uv.Matrix2D = function() {
  if (arguments.length === 0) {
    this.reset();
  } else if (arguments.length === 1 && arguments[0] instanceof uv.Matrix2D) {
    this.set(arguments[0].array());
  } else if (arguments.length === 6) {
    this.set(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
  }
};

uv.Matrix2D.prototype = {
  set: function() {
    if (arguments.length === 6) {
      var a = arguments;
      this.set([a[0], a[1], a[2],
                a[3], a[4], a[5]]);
    } else if (arguments.length === 1 && arguments[0] instanceof uv.Matrix2D) {
      this.elements = arguments[0].array();
    } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      this.elements = arguments[0].slice();
    }
  },
  get: function() {
    var outgoing = new pv.Matrix2D();
    outgoing.set(this.elements);
    return outgoing;
  },
  reset: function() {
    this.set([1, 0, 0, 0, 1, 0]);
  },
  // Returns a copy of the element values.
  array: function array() {
    return this.elements.slice();
  },
  translate: function(tx, ty) {
    this.elements[2] = tx * this.elements[0] + ty * this.elements[1] + this.elements[2];
    this.elements[5] = tx * this.elements[3] + ty * this.elements[4] + this.elements[5];
  },
  // Does nothing in Processing.
  transpose: function() {
  },
  mult: function(source, target) {
    var x, y;
    if (source instanceof uv.Vector) {
      x = source.x;
      y = source.y;
      if (!target) {
        target = new uv.Vector();
      }
    } else if (source instanceof Array) {
      x = source[0];
      y = source[1];
      if (!target) {
        target = [];
      }
    }
    if (target instanceof Array) {
      target[0] = this.elements[0] * x + this.elements[1] * y + this.elements[2];
      target[1] = this.elements[3] * x + this.elements[4] * y + this.elements[5];
    } else if (target instanceof uv.Vector) {
      target.x = this.elements[0] * x + this.elements[1] * y + this.elements[2];
      target.y = this.elements[3] * x + this.elements[4] * y + this.elements[5];
      target.z = 0;
    }
    return target;
  },
  multX: function(x, y) {
    return x * this.elements[0] + y * this.elements[1] + this.elements[2];
  },
  multY: function(x, y) {
    return x * this.elements[3] + y * this.elements[4] + this.elements[5];
  },
  skewX: function(angle) {
    this.apply(1, 0, 1, angle, 0, 0);
  },
  skewY: function(angle) {
    this.apply(1, 0, 1, 0, angle, 0);
  },
  determinant: function() {
    return this.elements[0] * this.elements[4] - this.elements[1] * this.elements[3];
  },
  // non-destrucive version
  inverse: function() {
    var res = new uv.Matrix2D(this);
    return res.invert() ? res : null;
  },
  invert: function() {
    var d = this.determinant();
    
    if ( Math.abs( d ) > uv.MIN_FLOAT ) {
      var old00 = this.elements[0];
      var old01 = this.elements[1];
      var old02 = this.elements[2];
      var old10 = this.elements[3];
      var old11 = this.elements[4];
      var old12 = this.elements[5];
      this.elements[0] =  old11 / d;
      this.elements[3] = -old10 / d;
      this.elements[1] = -old01 / d;
      this.elements[4] =  old00 / d;
      this.elements[2] = (old01 * old12 - old11 * old02) / d;
      this.elements[5] = (old10 * old02 - old00 * old12) / d;
      return true;
    }
    return false;
  },
  scale: function(sx, sy) {
    if (sx && !sy) {
      sy = sx;
    }
    if (sx && sy) {
      this.elements[0] *= sx;
      this.elements[1] *= sy;
      this.elements[3] *= sx;
      this.elements[4] *= sy;
    }
  },
  // matrix mult of the current matrix with the given matrix, stored in the current matrix
  apply: function() {
    if (arguments.length === 1 && arguments[0] instanceof uv.Matrix2D) {
      this.apply(arguments[0].array());
    } else if (arguments.length === 6) {
      var a = arguments;
      this.apply([a[0], a[1], a[2],
                  a[3], a[4], a[5]]);
    } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      var source = arguments[0];
      var result = [0, 0, this.elements[2],
                    0, 0, this.elements[5]];
      var e = 0;
      for (var row = 0; row < 2; row++) {
        for (var col = 0; col < 3; col++, e++) {
          result[e] += this.elements[row * 3 + 0] * source[col + 0] + this.elements[row * 3 + 1] * source[col + 3];
        }
      }
      this.elements = result.slice();
    }
  },
  preApply: function() {
    if (arguments.length === 1 && arguments[0] instanceof uv.Matrix2D) {
      this.preApply(arguments[0].array());
    } else if (arguments.length === 6) {
      var a = arguments;
      this.preApply([a[0], a[1], a[2],
                     a[3], a[4], a[5]]);
    } else if (arguments.length === 1 && arguments[0] instanceof Array) {
      var source = arguments[0];
      var result = [0, 0, source[2],
                    0, 0, source[5]];
      result[2]= source[2] + this.elements[2] * source[0] + this.elements[5] * source[1];
      result[5]= source[5] + this.elements[2] * source[3] + this.elements[5] * source[4];
      result[0] = this.elements[0] * source[0] + this.elements[3] * source[1];
      result[3] = this.elements[0] * source[3] + this.elements[3] * source[4];
      result[1] = this.elements[1] * source[0] + this.elements[4] * source[1];
      result[4] = this.elements[1] * source[3] + this.elements[4] * source[4];
      this.elements = result.slice();
    }
  },
  rotate: function(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var temp1 = this.elements[0];
    var temp2 = this.elements[1];
    this.elements[0] =  c * temp1 + s * temp2;
    this.elements[1] = -s * temp1 + c * temp2;
    temp1 = this.elements[3];
    temp2 = this.elements[4];
    this.elements[3] =  c * temp1 + s * temp2;
    this.elements[4] = -s * temp1 + c * temp2;
  },
  rotateZ: function(angle) {
    this.rotate(angle);
  },
  toString: function() {
    var digits = uv.printMatrixHelper(this.elements);
    var output = "";
    
    output += "[" +this.elements[0] + " " + this.elements[1] + " " + this.elements[2] + " ]\n";
    output += "[" +this.elements[3] + " " + this.elements[4] + " " + this.elements[5] + " ]\n\n";
    
    return output;
  }
};