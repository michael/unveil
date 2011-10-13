(function() {
var root = this;
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
// Matrix.js v1.1.0
// ==========================================================================
// Copyright (c) 2010 STRd6
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// 
// Loosely based on flash:
// http://www.adobe.com/livedocs/flash/9.0/ActionScriptLangRefV3/flash/geom/Matrix.html

(function() {
  /**
   * Create a new point with given x and y coordinates. If no arguments are given
   * defaults to (0, 0).
   */
  function Point(x, y) {
    return {
      /**
       * The x coordinate of this point.
       * @name x
       * @fieldOf Point#
       */
      x: x || 0,
      /**
       * The y coordinate of this point.
       * @name y
       * @fieldOf Point#
       */
      y: y || 0,
      /**
       * Adds a point to this one and returns the new point.
       * @name add
       * @methodOf Point#
       *
       * @param {Point} other The point to add this point to.
       * @returns A new point, the sum of both.
       * @type Point
       */
      add: function(other) {
        return Point(this.x + other.x, this.y + other.y);
      }
    };
  }

  /**
   * @param {Point} p1
   * @param {Point} p2
   * @returns The Euclidean distance between two points.
   */
  Point.distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  /**
   * If you have two dudes, one standing at point p1, and the other
   * standing at point p2, then this method will return the direction
   * that the dude standing at p1 will need to face to look at p2.
   * @param {Point} p1 The starting point.
   * @param {Point} p2 The ending point.
   * @returns The direction from p1 to p2 in radians.
   */
  Point.direction = function(p1, p2) {
    return Math.atan2(
      p2.y - p1.y,
      p2.x - p1.x
    );
  };

  /**
   * <pre>
   *  _        _
   * | a  c tx  |
   * | b  d ty  |
   * |_0  0  1 _|
   * </pre>
   * Creates a matrix for 2d affine transformations.
   *
   * concat, inverse, rotate, scale and translate return new matrices with the
   * transformations applied. The matrix is not modified in place.
   *
   * Returns the identity matrix when called with no arguments.
   * @name Matrix
   * @param {Number} [a]
   * @param {Number} [b]
   * @param {Number} [c]
   * @param {Number} [d]
   * @param {Number} [tx]
   * @param {Number} [ty]
   * @constructor
   */
  function Matrix(a, b, c, d, tx, ty) {
    a = a !== undefined ? a : 1;
    d = d !== undefined ? d : 1;

    return {
      /**
       * @name a
       * @fieldOf Matrix#
       */
      a: a,
      /**
       * @name b
       * @fieldOf Matrix#
       */
      b: b || 0,
      /**
       * @name c
       * @fieldOf Matrix#
       */
      c: c || 0,
      /**
       * @name d
       * @fieldOf Matrix#
       */
      d: d,
      /**
       * @name tx
       * @fieldOf Matrix#
       */
      tx: tx || 0,
      /**
       * @name ty
       * @fieldOf Matrix#
       */
      ty: ty || 0,

      /**
       * Returns the result of this matrix multiplied by another matrix
       * combining the geometric effects of the two. In mathematical terms, 
       * concatenating two matrixes is the same as combining them using matrix multiplication.
       * If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
       * http://mathworld.wolfram.com/MatrixMultiplication.html
       * @name concat
       * @methodOf Matrix#
       *
       * @param {Matrix} matrix The matrix to multiply this matrix by.
       * @returns The result of the matrix multiplication, a new matrix.
       * @type Matrix
       */
      concat: function(matrix) {
        return Matrix(
          this.a * matrix.a + this.c * matrix.b,
          this.b * matrix.a + this.d * matrix.b,
          this.a * matrix.c + this.c * matrix.d,
          this.b * matrix.c + this.d * matrix.d,
          this.a * matrix.tx + this.c * matrix.ty + this.tx,
          this.b * matrix.tx + this.d * matrix.ty + this.ty
        );
      },

      /**
       * Given a point in the pretransform coordinate space, returns the coordinates of 
       * that point after the transformation occurs. Unlike the standard transformation 
       * applied using the transformPoint() method, the deltaTransformPoint() method's 
       * transformation does not consider the translation parameters tx and ty.
       * @name deltaTransformPoint
       * @methodOf Matrix#
       * @see #transformPoint
       *
       * @return A new point transformed by this matrix ignoring tx and ty.
       * @type Point
       */
      deltaTransformPoint: function(point) {
        return Point(
          this.a * point.x + this.c * point.y,
          this.b * point.x + this.d * point.y
        );
      },

      /**
       * Returns the inverse of the matrix.
       * http://mathworld.wolfram.com/MatrixInverse.html
       * @name inverse
       * @methodOf Matrix#
       *
       * @returns A new matrix that is the inverse of this matrix.
       * @type Matrix
       */
      inverse: function() {
        var determinant = this.a * this.d - this.b * this.c;
        return Matrix(
          this.d / determinant,
          -this.b / determinant,
          -this.c / determinant,
          this.a / determinant,
          (this.c * this.ty - this.d * this.tx) / determinant,
          (this.b * this.tx - this.a * this.ty) / determinant
        );
      },

      /**
       * Returns a new matrix that corresponds this matrix multiplied by a
       * a rotation matrix.
       * @name rotate
       * @methodOf Matrix#
       * @see Matrix.rotation
       *
       * @param {Number} theta Amount to rotate in radians.
       * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
       * @returns A new matrix, rotated by the specified amount.
       * @type Matrix
       */
      rotate: function(theta, aboutPoint) {
        return this.concat(Matrix.rotation(theta, aboutPoint));
      },

      /**
       * Returns a new matrix that corresponds this matrix multiplied by a
       * a scaling matrix.
       * @name scale
       * @methodOf Matrix#
       * @see Matrix.scale
       *
       * @param {Number} sx
       * @param {Number} [sy]
       * @param {Point} [aboutPoint] The point that remains fixed during the scaling
       * @type Matrix
       */
      scale: function(sx, sy, aboutPoint) {
        return this.concat(Matrix.scale(sx, sy, aboutPoint));
      },

      /**
       * Returns the result of applying the geometric transformation represented by the 
       * Matrix object to the specified point.
       * @name transformPoint
       * @methodOf Matrix#
       * @see #deltaTransformPoint
       *
       * @returns A new point with the transformation applied.
       * @type Point
       */
      transformPoint: function(point) {
        return Point(
          this.a * point.x + this.c * point.y + this.tx,
          this.b * point.x + this.d * point.y + this.ty
        );
      },

      /**
       * Translates the matrix along the x and y axes, as specified by the tx and ty parameters.
       * @name translate
       * @methodOf Matrix#
       * @see Matrix.translation
       *
       * @param {Number} tx The translation along the x axis.
       * @param {Number} ty The translation along the y axis.
       * @returns A new matrix with the translation applied.
       * @type Matrix
       */
      translate: function(tx, ty) {
        return this.concat(Matrix.translation(tx, ty));
      }
    };
  }

  /**
   * Creates a matrix transformation that corresponds to the given rotation,
   * around (0,0) or the specified point.
   * @see Matrix#rotate
   *
   * @param {Number} theta Rotation in radians.
   * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
   * @returns 
   * @type Matrix
   */
  Matrix.rotation = function(theta, aboutPoint) {
    var rotationMatrix = Matrix(
      Math.cos(theta),
      Math.sin(theta),
      -Math.sin(theta),
      Math.cos(theta)
    );

    if(aboutPoint) {
      rotationMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          rotationMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return rotationMatrix;
  };

  /**
   * Returns a matrix that corresponds to scaling by factors of sx, sy along
   * the x and y axis respectively.
   * If only one parameter is given the matrix is scaled uniformly along both axis.
   * If the optional aboutPoint parameter is given the scaling takes place
   * about the given point.
   * @see Matrix#scale
   *
   * @param {Number} sx The amount to scale by along the x axis or uniformly if no sy is given.
   * @param {Number} [sy] The amount to scale by along the y axis.
   * @param {Point} [aboutPoint] The point about which the scaling occurs. Defaults to (0,0).
   * @returns A matrix transformation representing scaling by sx and sy.
   * @type Matrix
   */
  Matrix.scale = function(sx, sy, aboutPoint) {
    sy = sy || sx;

    var scaleMatrix = Matrix(sx, 0, 0, sy);

    if(aboutPoint) {
      scaleMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          scaleMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return scaleMatrix;
  };

  /**
   * Returns a matrix that corresponds to a translation of tx, ty.
   * @see Matrix#translate
   *
   * @param {Number} tx The amount to translate in the x direction.
   * @param {Number} ty The amount to translate in the y direction.
   * @return A matrix transformation representing a translation by tx and ty.
   * @type Matrix
   */
  Matrix.translation = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
  };

  /**
   * A constant representing the identity matrix.
   * @name IDENTITY
   * @fieldOf Matrix
   */
  Matrix.IDENTITY = Matrix();
  /**
   * A constant representing the horizontal flip transformation matrix.
   * @name HORIZONTAL_FLIP
   * @fieldOf Matrix
   */
  Matrix.HORIZONTAL_FLIP = Matrix(-1, 0, 0, 1);
  /**
   * A constant representing the vertical flip transformation matrix.
   * @name VERTICAL_FLIP
   * @fieldOf Matrix
   */
  Matrix.VERTICAL_FLIP = Matrix(1, 0, 0, -1);
  
  // Export to Unveil
  uv.Point = Point;
  uv.Matrix = Matrix;
}());


// Actor - Graphical object to be attached to the scene graph
// =============================================================================

uv.Actor = function(properties) {
  Data.Node.call(this);
  this.childCount = 0;
  
  this.properties = uv.extend({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    localX: 0,
    localY: 0,
    localScaleX: 1,
    localScaleY: 1,
    localRotation: 0,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    globalAlpha: 1,
    miterLimit: 10,
    visible: true,
    transformMode: 'object'
  }, properties);
  
  // init children
  this.replace('children', new Data.Hash());
  
  // Init motion tween container
  this.tweens = {};
  
  // Under mouse cursor
  this.active = false;
  
  // Event handlers
  this.handlers = {};
};

// Registration point for custom actors
uv.Actor.registeredActors = {};

uv.Actor.prototype = uv.inherit(Data.Node);


// Bind event

uv.Actor.prototype.bind = function(name, fn) {
  if (!this.handlers[name]) {
    this.handlers[name] = [];
  }
  this.handlers[name].push(fn);
};


// Trigger event

uv.Actor.prototype.trigger = function(name) {
  var that = this;
  if (this.handlers[name]) {
    for (var key in this.handlers[name]) {
      this.handlers[name][key].apply(that, []);
    }
  }
};


// Generic factory method that creates an actor based on an Actor Spec

uv.Actor.create = function(spec) {
  var constructor = uv.Actor.registeredActors[spec.type];
  if (!constructor) { 
    throw "Actor type unregistered: '" + spec.type + "'";
  }
  return new constructor(spec);
};


// The actor's unique id

uv.Actor.prototype.id = function() {
  return this.p('id') || this.nodeId;
};

uv.Actor.prototype.add = function(spec) {
  var actor;
  
  if (spec instanceof uv.Actor) {
    actor = spec;
  } else {
    actor = uv.Actor.create(spec);
  }
  
  if (!this.scene) {
    throw "You can't add childs to actors that don't have a scene reference";
  }
  
  // Register actor at the scene object
  this.scene.registerActor(actor);
  
  // Register as a child
  this.set('children', actor.id(), actor);
  actor.parent = this;
  
  // Call init hook if defined
  if (actor.init) {
    actor.init();
  }
  
  // Register children
  if (spec.actors) {
    
    spec.actors.forEach(function(actorSpec) {
      actor.add(actorSpec);
    });
  }
  return actor;
};


uv.Actor.prototype.get = function() {
  if (arguments.length === 1) {
    return this.scene.actors[arguments[0]];
  } else {
    // Delegate to Node#get
    return Data.Node.prototype.get.call(this, arguments[0], arguments[1]);
  }
};


// Remove child by ID
uv.Actor.prototype.remove = function(matcher) {
  var that = this;
  if (matcher instanceof Function) {
    this.traverse().forEach(function(actor) {
      if (matcher(actor)) {
        that.scene.remove(actor.id());
      }
    });
  } else {
    if (this.get('children', matcher)) {
      // Remove child
      this.all('children').del(matcher);
      
      // Remove from scene
      delete this.scene.actors[matcher];
      delete this.scene.interactiveActors[matcher];
    }

    // Children hunt
    this.all('children').each(function(child, key, i) {
      child.remove(matcher);
    });
  }
};


uv.Actor.prototype.traverse = function() {
  return this.scene.properties.traverser(this);
};

// Evaluates a property (in case of a function
// the result of the function is returned)

uv.Actor.prototype.property = function(property, value) {
  if (value) {
    this.properties[property] = value;
    return value;
  } else {
    if (this.properties[property] instanceof Function)
      return this.properties[property].call(this);
    else
      return this.properties[property];    
  }
};

uv.Actor.prototype.p = uv.Actor.prototype.property;

// Registers a Tween on demand

uv.Actor.prototype.animate = function(properties, duration, easing) {
  var scene = this.scene,
	    tween = new uv.Tween(this.properties)
    		.to(duration || 1, properties)
    		.easing(easing || uv.Tween.Easing.Expo.EaseInOut)
    		.onComplete(function() {
    		  scene.unexecute(uv.cmds.RequestFramerate);
    		  // Remove from registered tweens
    		  uv.TweenManager.remove(tween);
    		});
  scene.execute(uv.cmds.RequestFramerate);
  return tween.start();
};


// Dynamic Matrices
// -----------------------------------------------------------------------------

// TODO: allow users to specify the transformation order (rotate, translate, scale)

uv.Actor.prototype.tShape = function(x, y) {
  return uv.Matrix()
         .translate(this.p('localX'), this.p('localY'))
         .rotate(this.p('localRotation'))
         .scale(this.p('localScaleX'), this.p('localScaleY'));
};

uv.Actor.prototype.tWorldParent = function() {
  if (this.parent) {
    return this.parent._tWorld;
  } else {
    return uv.Matrix();
  }
};

uv.Actor.prototype.tWorld = function() {
  return uv.Matrix()
         .concat(this.tWorldParent())
         .translate(this.p('x'), this.p('y'))
         .rotate(this.p('rotation'))
         .scale(this.p('scaleX'), this.p('scaleY'));
};

// Compiles and caches the current World Transformation Matrix

uv.Actor.prototype.compileMatrix = function() {
  this.update();
  this._tWorld = this.tWorld();

  if (this.all('children')) {
    this.all('children').each(function(child, key, i) {
      child.compileMatrix();
    });
  }
};


// Drawing, masking and rendering
// -----------------------------------------------------------------------------

uv.Actor.prototype.update = function() {
  // Update motion tweens
  uv.TweenManager.update();
};

uv.Actor.prototype.applyStyles = function(ctx) {
  ctx.fillStyle = this.p('fillStyle');
  ctx.strokeStyle = this.p('strokeStyle');
  ctx.lineWidth = this.p('lineWidth');
  ctx.lineCap = this.p('lineCap');
  ctx.lineJoin = this.p('lineJoin');
  ctx.globalAlpha = this.p('globalAlpha');
  ctx.miterLimit = this.p('miterLimit');
};

uv.Actor.prototype.draw = function(ctx) {};

uv.Actor.prototype.checkActive = function(ctx, mouseX, mouseY) {
  var p = new uv.Point(mouseX,mouseY);
    
  // TODO: Add proper check for statically rendered actors,
  //       based on this.scene.activeDisplay's view matrix  
  var pnew = this._tWorld.inverse().transformPoint(p);
  mouseX = pnew.x;
  mouseY = pnew.y;
  
  if (this.bounds && ctx.isPointInPath) {
    this.drawBounds(ctx);
    if (ctx.isPointInPath(mouseX, mouseY))
      this.active = true;
    else
      this.active = false;
  }
  return this.active;
};

// Bounds used for mouse picking

uv.Actor.prototype.drawBounds = function(ctx) {
  var bounds = this.bounds(),
      start, v;
  start = bounds.shift();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  while (v = bounds.shift()) {
    ctx.lineTo(v.x, v.y);
  }
  ctx.lineTo(start.x, start.y);
};


uv.Actor.prototype.render = function(ctx, tView) {
  if (!this.p('visible')) return;
  this.applyStyles(ctx);
  this.transform(ctx, tView);
  this.draw(ctx, tView);
};


// Applies the transformation matrix
uv.Actor.prototype.transform = function(ctx, tView) {
  var m = this.tShape().concat(tView).concat(this._tWorld),
      t;
  if (this.p('transformMode') === 'origin') {
    // Extract the translation of the matrix
    t = m.transformPoint(uv.Point(0,0));
    ctx.setTransform(1, 0, 0, 1, t.x, t.y);
  } else {
    ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
  }
};
uv.traverser = {};

uv.traverser.BreadthFirst = function(root) {
  var queue = [],
      nodes = [],
      node;
  
  queue.push(root); // enqueue
  while (queue.length > 0) {
    node = queue.shift(); // dequeue
    if (node.p('visible')) {
      nodes.push(node);
      // Enqueue children
      node.all('children').each(function(node, key, index) {
        queue.push(node);
      });
    }
  }
  return nodes;
};

uv.traverser.DepthFirst = function(root) {
  var stack = [],
      nodes = [],
      node;
  
  stack.push(root);
  while (stack.length > 0) {
    node = stack.pop();
    if (node.p('visible')) {
      nodes.push(node);
      // Push children
      node.all('children').each(function(node, key, index) {
        stack.push(node);
      });
    }
  }
  return nodes;
};

uv.behaviors = {};

uv.behaviors.adjust = function(display, m) {
  var b = display.bounds();
  // clamp to scene boundaries
  if (display.bounded) {
    m.a = m.d = Math.max(1, m.a);
    m.tx = Math.max(b.x, Math.min(0, m.tx));
    m.ty = Math.max(b.y, Math.min(0, m.ty));
  }
  return m;
};

uv.behaviors.Zoom = function(display) {
  function mouseWheel(e) {
    var delta = (e.wheelDelta / 120 || -e.detail),
        m = display.tView.scale(
          1+0.005 * delta,
          1+0.005 * delta,
          uv.Point(display.scene.mouseX, display.scene.mouseY)
        );
    display.tView = (delta < 0) ? uv.behaviors.adjust(display, m) : m;
    display.trigger('viewChange');
  }
  display.canvas.addEventListener("mousewheel", mouseWheel, false);
  display.canvas.addEventListener("DOMMouseScroll", mouseWheel, false);
};

uv.behaviors.Pan = function(display) {
  var pos, // initial mouse position
      view, // cached view matrix
      panning = false;
  
  function mouseDown() {
    p = uv.Point(display.mouseX, display.mouseY);
    view = display.tView;
    panning = true;
  }
  
  function mouseMove() {
    if (!panning) return;
    var x = (display.mouseX - p.x),
        y = (display.mouseY - p.y),
        m = uv.Matrix.translation(x, y).concat(view);
    display.tView = uv.behaviors.adjust(display, m);
    display.trigger('viewChange');
  }
  
  function release() {
    panning = false;
  }
  
  display.canvas.addEventListener("mousedown", mouseDown, false);
  display.canvas.addEventListener("mousemove", mouseMove, false);
  display.canvas.addEventListener("mouseup", release, false);
  display.canvas.addEventListener("mouseout", release, false);
};
uv.Display = function(scene, properties) {
  var that = this;
  
  // super call
  uv.Actor.call(this, uv.extend({
    fillStyle: ''
  }, properties));
  
  this.scene = scene;
  this.element = document.getElementById(properties.container);
  this.canvas = document.createElement("canvas");
  this.canvas.setAttribute('width', properties.width);
  this.canvas.setAttribute('height', properties.height);
  this.canvas.style.position = 'relative';
  this.element.appendChild(this.canvas);

  this.width = properties.width;
  this.height = properties.height;
  
  this.bounded = properties.bounded || true;
  
  this.ctx = this.canvas.getContext("2d");
  this.tView = uv.Matrix();
  
  // attach behaviors
  if (properties.zooming) {
    this.zoombehavior = new uv.behaviors.Zoom(this);
  }
  
  if (properties.panning) {
    this.panbehavior = new uv.behaviors.Pan(this);
  }
    
  // Register mouse events
  function mouseMove(e) {
    var mat = that.tView.inverse(),
        pos;
    
    if (e.offsetX) {
      pos = new uv.Point(e.offsetX, e.offsetY);
    } else if (e.layerX) {
      pos = new uv.Point(e.layerX, e.layerY);
    }
    
    if (pos) {
      that.mouseX = pos.x;
      that.mouseY = pos.y;
      worldPos = mat.transformPoint(pos);
      that.scene.mouseX = parseInt(worldPos.x, 10);
      that.scene.mouseY = parseInt(worldPos.y, 10);
      that.scene.activeDisplay = that;
    }
  }
  
  function mouseOut() {
    that.scene.mouseX = NaN;
    that.scene.mouseY = NaN;
  }
  
  function interact() {
    that.scene.trigger('interact');
  }
  
  function click() {
    uv.each(that.scene.activeActors, function(a) {
      a.trigger('click');
    });
  }
  
  this.canvas.addEventListener("mousemove", interact, false);
  this.canvas.addEventListener("DOMMouseScroll", interact, false);
  this.canvas.addEventListener("mousemove", mouseMove, false);
  this.canvas.addEventListener("mousewheel", interact, false);
  this.canvas.addEventListener("mouseout", mouseOut, false);
  this.canvas.addEventListener("click", click, false);
};

uv.Display.prototype = uv.inherit(uv.Actor);

// Convert world pos to display pos

uv.Display.prototype.displayPos = function(point) {
  return this.tView.transformPoint(pos);
};

uv.Display.prototype.zoom = function(point) {
  return this.tView.a;
};

// Convert display pos to world pos

uv.Display.prototype.worldPos = function(pos) {
  return this.tView.inverse().transformPoint(pos);
};

// Yield bounds used for viewport constraining

uv.Display.prototype.bounds = function() {
  // Consider area that doesn't fit on the display
  var dx = Math.max(0, this.scene.p('width') - this.width),
      dy = Math.max(0, this.scene.p('width') - this.width);
  
  return {
      x: (1 - this.tView.a) * this.width - this.tView.a * dx,
      y: (1 - this.tView.a) * this.height - this.tView.a * dy
  };
};

// Updates the display (on every frame)

uv.Display.prototype.refresh = function() {
  var that = this,
      actors,
      displayActors;


  this.ctx.clearRect(0,0, this.width, this.height);
  // Scene background
  if (this.scene.p('fillStyle') !== '') {
    this.ctx.fillStyle = this.scene.p('fillStyle');
    this.ctx.fillRect(0, 0, this.width, this.height);    
  }
  
  this.ctx.save();
  
  actors = this.scene.traverse();
  actors.shift();
  uv.each(actors, function(actor, index) {
    actor.render(that.ctx, that.tView);
  });
  
  // Draw the display components
  displayActors = this.traverse();
  actors.shift();
  uv.each(displayActors, function(actor, index) {
    actor.render(that.ctx, uv.Matrix());
  });
  
  this.ctx.restore();
};
// Commands
// =============================================================================
// 
// Commands are used to modify properties on the scene. They can be executed
// one or many times, and they can be unexecuted to recover the original state

uv.cmds = {};

uv.cmds.RequestFramerate = function(scene, opts) {
  this.scene = scene;
  this.requests = 0;
  this.framerate = opts.framerate;
  this.originalFramerate = this.scene.framerate;
};

uv.cmds.RequestFramerate.className = 'RequestFramerate';

uv.cmds.RequestFramerate.prototype.execute = function() {
  this.requests += 1;
  this.scene.setFramerate(this.framerate);
};

uv.cmds.RequestFramerate.prototype.unexecute = function() {
  this.requests -= 1;
  if (this.requests <= 0) {
    this.scene.setFramerate(this.originalFramerate);
  }
};
// Scene
// =============================================================================

uv.Scene = function(properties) {
  var that = this;
  
  // super call
  uv.Actor.call(this, uv.extend({
    width: 0,
    height: 0,
    fillStyle: '',
    idleFramerate: 0,
    framerate: 50,
    traverser: uv.traverser.DepthFirst
  }, properties));
  
  
  this.mouseX = NaN;
  this.mouseY = NaN;
  
  // Keeps track of actors that capture mouse events
  this.interactiveActors = {};
  
  // Currently active actors (under cursor)
  this.activeActors = [];
  
  // Keep track of all Actors
  this.actors = {};
  
  // The scene property references the Scene an Actor belongs to
  this.scene = this;
  
  // Attached Displays
  this.displays = [];
  if (properties.displays) {
    uv.each(properties.displays, function(display) {
      that.displays.push(new uv.Display(that, display));
    });    
  }
  
  this.activeDisplay = this.displays[0];
  this.fps = 0;
  
  this.framerate = this.p('idleFramerate');
  
  // Commands hook in here
  this.commands = {};
  this.register(uv.cmds.RequestFramerate, {framerate: this.p('framerate')});
  
  // Register actors
  if (properties.actors) {
    uv.each(properties.actors, function(actorSpec) {
      that.add(actorSpec);
    });
  }
  
  var timeout;
  var requested = false;
  
  // Listen to interaction
  this.bind('interact', function() {
      if (!requested) {
        that.execute(uv.cmds.RequestFramerate);
        requested = true;
      }
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        requested = false;
        that.unexecute(uv.cmds.RequestFramerate);
      }, 1000);
  });
};

uv.Scene.prototype = uv.inherit(uv.Actor);

uv.Scene.prototype.registerActor = function(actor) {
  var id = actor.id();
  if (this.actors[id])
    throw "ID '" + id + "' already registered.";
  
  // Set the scene reference
  actor.scene = this;
  
  // Register actor in scene space
  this.actors[id] = actor;
  
  // Register as interactive
  if (actor.p('interactive')) {
    this.interactiveActors[actor.id()] = actor;
  }
};

uv.Scene.prototype.start = function() {
  this.running = true;
  this.trigger('start');
  this.loop();
  this.checkActiveActors();
};

uv.Scene.prototype.setFramerate = function(framerate) {
  this.framerate = framerate;
  clearTimeout(this.nextLoop);
  clearTimeout(this.nextPick);
  this.loop();
  this.checkActiveActors();
};

// The draw loop

uv.Scene.prototype.loop = function() {
  var that = this,
      start, duration;
  
  if (this.running) {
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    start = new Date().getTime();
    this.render();
    duration = new Date().getTime()-start;
    if (this.framerate > 0) {
      this.nextLoop = setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
    }
  }
};

uv.Scene.prototype.render = function() {
  this.trigger('frame');
  this.compileMatrix();
  this.refreshDisplays();
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
  this.trigger('stop');
};

uv.Scene.prototype.checkActiveActors = function() {
  var ctx = this.displays[0].ctx,
      that = this,
      prevActiveActors = this.activeActors;
  
  if (this.running) {
    if (this.scene.mouseX !== NaN) {
      
      this.activeActors = [];
      uv.each(this.interactiveActors, function(actor) {
        var active = actor.checkActive(ctx, that.scene.mouseX, that.scene.mouseY);
        if (active) {
          that.activeActors.push(actor);
          if (!uv.include(prevActiveActors, actor)) {
            actor.trigger('mouseover');
          }
        } else {
          if (uv.include(prevActiveActors, actor)) {
            actor.trigger('mouseout');
          }
        }
      });
    }
    if (that.framerate > 0) {
      this.nextPick = setTimeout(function() {
        that.checkActiveActors(); 
      }, 1000/Math.min(that.framerate, 15));
    }
  }
};


uv.Scene.prototype.refreshDisplays = function() {
  uv.each(this.displays, function(d) {
    d.compileMatrix();
    d.refresh();
  });
};

uv.Scene.prototype.display = function(display) {
  var d = new uv.Display(this, display);
  this.displays.push(d);
  return d;
};

// Commands
// -----------------------------------------------------------------------------

uv.Scene.prototype.register = function(cmd, options) {
  this.commands[cmd.className] = new cmd(this, options);
};

uv.Scene.prototype.execute = function(cmd) {
  this.commands[cmd.className].execute();
};

uv.Scene.prototype.unexecute = function(cmd) {
  this.commands[cmd.className].unexecute();
};
/**
 * @author sole / http://soledadpenades.com/
 * @author mr.doob / http://mrdoob.com/
 * Easing equations by Robert Penner http://www.robertpenner.com/easing/ (BSD license)
 */
 
uv.TweenManager = uv.TweenManager || ( function() {
	var i, time, tweens = [];

	this.add = function (tween) {
		tweens.push(tween);
	};

	this.remove = function (tween) {
		for (var i = 0, l = tweens.length; i < l; i++) {
			if (tween == tweens[ i ]) {
				tweens.splice(i, 1);
				return;
			}
		}
	};
	
	this.update = function() {
		i = 0;
		time = new Date().getTime();
		while( i < tweens.length ) {
			tweens[ i ].update( time ) ? i++ : tweens.splice( i, 1 );
		}
	};
	return this;
})(),

// uv.Tween = uv.Tween || {};

uv.Tween = function ( object ) {
	uv.TweenManager.add( this );

	var _object = object,
	_valuesStart = {},
	_valuesChange = {},
	_valuesTo = {},
	_duration = 1000,
	_delayTime = 0,
	_startTime = null,
	_easingFunction = uv.Tween.Easing.Back.EaseInOut,
	_nextTween = null,
	_onUpdateFunction = null,
	_onCompleteFunction = null,
	_completed = false;

	this.to = function( duration, properties ) {
		_duration = duration * 1000;
		for ( var property in properties ) {
			if ( _object[ property ] === null ) {
				continue;
			}
			// The current values are read when the tween starts;
			// here we only store the final desired values
			_valuesTo[ property ] = properties[ property ];
		}
		return this;
	};

	this.start = function() {
		_completed = false;
		_startTime = new Date().getTime() + _delayTime;
		for ( var property in _valuesTo ) {
			if ( _object[ property ] === null ) {
				continue;
			}
			_valuesStart[ property ] = _object[ property ];
			_valuesChange[ property ] = _valuesTo[ property ] - _object[ property ];
		}
		return this;
	}

	this.delay = function ( amount ) {
		_delayTime = amount * 1000;
		return this;
	};

	this.easing = function ( easing ) {
		_easingFunction = easing;
		return this;
	};

	this.chain = function ( chainedTween ) {
		_nextTween = chainedTween;
	}

	this.onUpdate = function ( onUpdateFunction ) {
		_onUpdateFunction = onUpdateFunction;
		return this;
	};

	this.onComplete = function ( onCompleteFunction ) {
		_onCompleteFunction = onCompleteFunction;
		return this;
	};

	this.update = function ( time ) {
		var property, elapsed;

		if ( time < _startTime || _startTime === null) {
			return true;
		}

		if ( _completed ) {
			return (_nextTween === null);
		}
		elapsed = time - _startTime;

		if( elapsed > _duration ) {

			_completed = true;
			_startTime = null;

			if(_onCompleteFunction !== null) {
				_onCompleteFunction();
			}

			if(_nextTween !== null) {
				_nextTween.start();
				return true; // this tween cannot be safely destroyed
			} else {
				return false; // no associated tweens, tween can be destroyed
			}
		}

		for ( property in _valuesChange ) {
			_object[ property ] = _easingFunction(elapsed, _valuesStart[ property ], _valuesChange[ property ], _duration );
		}

		if ( _onUpdateFunction !== null ) {
			_onUpdateFunction.apply(_object);
		}
		return true;
	};

	this.destroy = function () {
		uv.TweenManager.remove(this);
	};
};


uv.Tween.Easing = { Back: {}, Elastic: {}, Expo: {}, Linear: {} };

uv.Tween.Easing.Back.EaseIn = function( t, b, c, d ) {
	var s = 1.70158;
	return c * ( t /= d  ) * t * ( ( s + 1 ) * t - s ) + b;
};

uv.Tween.Easing.Back.EaseOut = function( t, b, c, d ) {
	var s = 1.70158;
	return c * ( ( t = t / d - 1 ) * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
};

uv.Tween.Easing.Back.EaseInOut = function( t, b, c, d ) {
	var s = 1.70158;
	if ( ( t /= d / 2 ) < 1 ) return c / 2 * ( t * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t - s ) ) + b;
	return c / 2 * ( ( t -= 2 ) * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t + s ) + 2 ) + b;
};

uv.Tween.Easing.Elastic.EaseIn = function( t, b, c, d ) {
	if ( t == 0 ) return b;
	if ( ( t /= d ) == 1 ) return b + c;
	var p = d * .3;
	var a = c;
	var s = p / 4;
	return - ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
};

uv.Tween.Easing.Elastic.EaseOut = function( t, b, c, d ) {
	if ( t == 0 ) return b;
	if ( ( t /= d ) == 1 ) return b + c;
	var p = d * .3;
	var a = c;
	var s = p / 4;
	return ( a * Math.pow( 2, - 10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b );
};

uv.Tween.Easing.Elastic.EaseInOut = function(t, b, c, d) {
	if ( t == 0 ) return b;
	if ( ( t /= d / 2 ) == 2 ) return b + c;
	var p = d * ( .3 * 1.5 );
	var a = c;
	var s = p / 4;
	if ( t < 1 ) return - .5 * ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
	return a * Math.pow( 2, - 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * .5 + c + b;
};

uv.Tween.Easing.Expo.EaseIn = function(t, b, c, d) {
	return ( t == 0) ? b : c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
};

uv.Tween.Easing.Expo.EaseOut = function(t, b, c, d) {
	return ( t == d ) ? b + c : c * ( - Math.pow( 2, - 10 * t / d) + 1) + b;
};

uv.Tween.Easing.Expo.EaseInOut = function(t, b, c, d) {
	if ( t == 0 ) return b;
	if ( t == d ) return b+c;
	if ( ( t /= d / 2 ) < 1) return c / 2 * Math.pow( 2, 10 * ( t - 1 ) ) + b;
	return c / 2 * ( - Math.pow( 2, - 10 * --t ) + 2) + b;
};

uv.Tween.Easing.Linear.EaseNone = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseIn = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseOut = function (t, b, c, d) {
		return c*t/d + b;
};

uv.Tween.Easing.Linear.EaseInOut = function (t, b, c, d) {
		return c*t/d + b;
};

// Rect
// =============================================================================

uv.Rect = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    width: 0,
    height: 0,
    fillStyle: '#777',
    strokeStyle: '#000',
    lineWidth: 0
  }, properties));
};

uv.Actor.registeredActors.rect = uv.Rect;

uv.Rect.prototype = uv.inherit(uv.Actor);

uv.Rect.prototype.bounds = function() {
  return [
    { x: 0, y: 0 },
    { x: this.p('width'), y: 0 },
    { x: this.p('width'), y: this.p('height') },
    { x: 0, y: this.p('height') }
  ];
};

uv.Rect.prototype.draw = function(ctx, tView) {
  if (this.p('fillStyle')) {
    ctx.fillRect(0, 0, this.p('width'), this.p('height'));
  }
  
  if (this.p('lineWidth') > 0) {
    ctx.strokeRect(0, 0, this.p('width'), this.p('height'));
  }
};

// Label
// =============================================================================
uv.Label = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    text: '',
    textAlign: 'start',
    font: '12px Helvetica, Arial',
    fillStyle: '#444',
    lineWidth: 0,
    backgroundStyle: '#eee',
    background: false
  }, properties));
};

uv.Actor.registeredActors.label = uv.Label;

uv.Label.prototype = uv.inherit(uv.Actor);

uv.Label.prototype.draw = function(ctx, tView) {
  ctx.font = this.p('font');
  
  ctx.textAlign = this.p('textAlign');
  ctx.fillText(this.p('text'), 0, 0);
};

// Circle
// =============================================================================

uv.Circle = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    radius: 20,
    strokeWeight: 2,
    lineWidth: 3,
    strokeStyle: '#fff'
  }, properties));
};

uv.Actor.registeredActors.circle = uv.Circle;

uv.Circle.prototype = uv.inherit(uv.Actor);

uv.Circle.prototype.bounds = function() {
  return [
    { x: -this.p('radius'), y: -this.p('radius') },
    { x: this.p('radius'),  y: -this.p('radius') },
    { x: this.p('radius'),  y: this.p('radius') },
    { x: -this.p('radius'), y: this.p('radius') }
  ];
};

uv.Circle.prototype.draw = function(ctx, tView) {  
  ctx.fillStyle = this.p('fillStyle');
  ctx.strokeStyle = this.p('strokeStyle');
  ctx.lineWidth = this.p('lineWidth');
  
  ctx.beginPath();
  ctx.arc(0,0,this.p('radius'),0,Math.PI*2, false);
  ctx.closePath();
  if (this.p('lineWidth') > 0) {
    ctx.stroke();
  }
  ctx.fill();
};

// Path
// =============================================================================

uv.Path = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    points: [],
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: ''
  }, properties));
  
  this.transformedPoints = this.points = [].concat(this.p('points'));
};

uv.Actor.registeredActors.path = uv.Path;

uv.Path.prototype = uv.inherit(uv.Actor);

uv.Path.prototype.transform = function(ctx, tView) {
  this.transformedPoints = this.points = [].concat(this.p('points'));
  if (this.p('transformMode') === 'origin') {
    var m = this.tShape().concat(tView).concat(this._tWorld);
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.transformedPoints = this.points.map(function(p) {
      var tp   = m.transformPoint(p),
          tcp1 = m.transformPoint(uv.Point(p.cp1x, p.cp1y)),
          tcp2 = m.transformPoint(uv.Point(p.cp2x, p.cp2y)),
          result;
      result = {x: tp.x, y: tp.y};
      if (p.cp1x && p.cp1y) {
        result.cp1x = tcp1.x;
        result.cp1y = tcp1.y;        
      }
      if (p.cp2x && p.cp2y) {
        result.cp2x = tcp2.x;
        result.cp2y = tcp2.y;        
      }
      return result;
    });
  } else {
    uv.Actor.prototype.transform.call(this, ctx, tView);
  }
};


uv.Path.prototype.draw = function(ctx, tView) {  
  var points = [].concat(this.transformedPoints),
      v;
  
  if (points.length >= 1) {
    ctx.beginPath();
    v = points.shift();
    ctx.moveTo(v.x, v.y);
    while (v = points.shift()) {
      if (v.cp1x && v.cp2x) {
        ctx.bezierCurveTo(v.cp1x, v.cp1y, v.cp2x,v.cp2y, v.x, v.y);
      } else if (v.cp1x) {
        ctx.quadraticCurveTo(v.cp1x, v.cp1y, v.x, v.y);
      } else {
        ctx.lineTo(v.x, v.y);
      }
    }
    if (this.p('lineWidth') > 0 && this.p('strokeStyle') !== '') {
      ctx.stroke();
    }
    
    if (this.p('fillStyle') !== '') {
      ctx.fill();
    }
    ctx.closePath();
  }
};

// export namespace
root.uv = uv;

// Export the uv object for CommonJS.
if (typeof exports !== 'undefined') exports.uv = uv;
})();
