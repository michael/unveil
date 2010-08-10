// Actor - Graphical object to be attached to the scene graph
// =============================================================================

uv.Actor = function(properties) {
  uv.Node.call(this);
  this.childCount = 0;
  
  this.properties = _.extend({
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
    visible: true,
    preserveShape: false,
    sticky: false
  }, properties);
  
  this.replace('children', new uv.SortedHash());
  
  // Under mouse cursor
  this.active = false;
};

uv.Actor.prototype = Object.extend(uv.Node);


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


// Recursively sets the scene reference to itself and all childs.
// Registers an interactive node on the scene object if the user explicitly
// declares the node as interactive, where interactivity conforms to activated
// enabled interaction.

uv.Actor.prototype.setScene = function(scene) {
  this.scene = scene;
  if (this.properties.interactive) {
    scene.interactiveActors.push(this);
  }
  if (this.all('children')) {
    this.all('children').each(function(index, child) {
      child.setScene(scene);
    });
  }
};

// Adds a new Actor as a child

uv.Actor.prototype.add = function(child) {
  this.set('children', this.childCount+=1, child);
  child.parent = this;
  return child;
};


// Dynamic Matrices
// -----------------------------------------------------------------------------

uv.Actor.prototype.tWorldParent = function() {
  var m;
  if (this.parent) {
    m = new uv.Matrix2D(this.parent._tWorld);
  } else {
    m = new uv.Matrix2D();
  }
  return m;
};


uv.Actor.prototype.tWorld = function() {
  var m = new uv.Matrix2D();
  m.apply(this.tWorldParent());
  m.translate(this.p('x'), this.p('y'));
  m.rotate(this.p('rotation'));
  m.scale(this.p('scaleX'), this.p('scaleY'));
  return m;
};


uv.Actor.prototype.tShape = function(x, y) {
  var m = new uv.Matrix2D();
  m.translate(this.p('localX'), this.p('localY'));
  m.rotate(this.p('localRotation'));
  m.scale(this.p('localScaleX'), this.p('localScaleY'));
  return m;
};

// Compiles and caches the current World Transformation Matrix

uv.Actor.prototype.compileMatrix = function() {
  this.update();
  this._tWorld = this.tWorld();

  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.compileMatrix();
    });
  }
};

// Calculate WorldView Transformation Matrix

uv.Actor.prototype.tWorldView = function(tView) {  
  var t, pos,
      view = this.properties.sticky ? new uv.Matrix2D() : tView;
  
  if (this.properties.preserveShape) {
    t = new uv.Matrix2D(view);
    t.apply(this._tWorld);
    pos = t.mult(new uv.Vector(0,0));
    t.reset();
    t.translate(pos.x, pos.y);
    t.apply(this.tShape());
  } else {
    t = this.tShape();
    t.apply(view);
    t.apply(this._tWorld);
  }
  
  return t;
};


// Drawing, masking and rendering
// -----------------------------------------------------------------------------

uv.Actor.prototype.update = function() {};
uv.Actor.prototype.draw = function(ctx) {};

uv.Actor.prototype.checkActive = function(ctx, mouseX, mouseY) {
  var p = new uv.Vector(mouseX,mouseY),
      t = new uv.Matrix2D(this._tWorld);
  
  // TODO: Add proper check for statically rendered actors,
  //       based on this.scene.activeDisplay's view matrix  
  
  pnew = t.inverse().mult(p);
  mouseX = pnew.x;
  mouseY = pnew.y;
  
  if (this.hasBounds() && ctx.isPointInPath) {
    this.drawBounds(ctx);
    if (ctx.isPointInPath(mouseX, mouseY))
      this.active = true;
    else
      this.active = false;
  }
  return false;
};


uv.Actor.prototype.hasBounds = function() {
  var bounds = this.p('bounds');
  return bounds && bounds.length >= 3;
};


uv.Actor.prototype.drawBounds = function(ctx) {
  var bounds = this.p('bounds'),
      start, v;
  start = bounds.shift();
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  while (v = bounds.shift()) {
    ctx.lineTo(v.x, v.y);
  }
  ctx.lineTo(start.x, start.y);
};


// Draws the Actor to a display

uv.Actor.prototype.render = function(ctx, tView) {
  var that = this,
      t = this.tWorldView(tView);
      
  if (!this.p('visible')) return;
  
  ctx.setTransform(t.elements[0], t.elements[1], t.elements[3], 
                   t.elements[4], t.elements[2], t.elements[5]);
  this.draw(ctx);
};
