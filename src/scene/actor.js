// Actor - Graphical object to be attached to the scene graph
// =============================================================================

uv.Actor = function(properties) {
  uv.Node.call(this);
  this.childCount = 0;
  
  // Default actor properties
  this.properties = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    fillStyle: '#000',
    strokeStyle: '#000',
    visible: true
  };
  
  _.extend(this.properties, properties);
  
  // Under mouse cursor
  this.active = false;
  
  // The modification matrix
  // Works like a regular transformation matrix, with the difference
  // that it doesn't describe the whole transformation to be applied.
  // The render() method first applies the current properties 
  // (x, y, scaleX, scaleY) the modification matrix is applied subsequently.
  this.matrix = new uv.Matrix2D();
};

uv.Actor.prototype = Object.extend(uv.Node);

// evaluates a property (in case of a function
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

// Property get-setter aliases
uv.Actor.prototype.prop = uv.Actor.prototype.property;
uv.Actor.prototype.p = uv.Actor.prototype.property;

// Recursively sets the scene reference to itself and all childs.
// Registers an interactive node on the scene object if the user explicitly
// declares the node as interactive, where interactivity conforms to activated
// enabled interaction.

uv.Actor.prototype.setScene = function(scene) {
  this.scene = scene;
  if (this.properties.interactive) {
    scene.interactiveNodes.push(this);
  }
  
  if (this.all('children')) {
    this.all('children').each(function(index, child) {
      child.setScene(scene);
    });
  }
};


// Adds a new actor to the scene.
// The object is attached as a child object

uv.Actor.prototype.add = function(child) {
  this.set('children', this.childCount+=1, child);
  child.parent = this;
  return child;
};


// Matrix transformations
// -----------------------------------------------------------------------------
// 
// You have full control about the current transformation matrix. Be aware that
// Actor properties like x, y, scaleX, scaleY, rotation are applied in the first
// place. After that this modification matrix is applied. It's good practice to
// not specify any properties when working with the modification matrix. If you
// do that you can treat the modification matrix as the actual transformation
// matrix.
// 
// Destructive operations
// .............................................................................
//
// Those methods all reset the modification matrix for now. So you cant combine
// setScale() and setRotation()

// Scales and rotates around a given point
// Rotation does not work yet
// TODO: implement rotation according to [R] = [T]-1 * [R0] * [T]

uv.Actor.prototype.setScaleAndRotateAroundPos = function(scaleX, scaleY, rot, rx, ry) {
  this.matrix.reset();
  this.matrix.translate(rx, ry);
  this.matrix.scale(scaleX, scaleY);
  this.matrix.translate(-rx, -ry);
};

uv.Actor.prototype.setTranslation = function(x, y) {
  this.matrix.reset();
  this.matrix.translate(x, y);
};

uv.Actor.prototype.setScale = function(scaleX, scaleY) {
  this.matrix.reset();
  this.matrix.scale(scaleX, scaleY);
};

uv.Actor.prototype.setRotation = function(rotation) {
  this.matrix.reset();
  this.matrix.rotate(rotation);
};

// Non destructive operations
// .............................................................................
// 
// Those methods can be chained together. The modification matrix is updated
// according to the specified operation.

uv.Actor.prototype.translate = function(x, y) {
  this.matrix.translate(x, y);
  return this;
};

uv.Actor.prototype.scale = function(scaleX, scaleY) {
  this.matrix.scale(scaleX, scaleY);
  return this;
};

uv.Actor.prototype.rotate = function(rotation, rx, ry) {
  this.matrix.rotate(rotation);
  return this;
};


// Drawing, masking and rendering
// -----------------------------------------------------------------------------

uv.Actor.prototype.update = function() {};
uv.Actor.prototype.draw = function(ctx) {};

uv.Actor.prototype.checkActive = function(ctx, mouseX, mouseY) {
  if (this.drawMask && ctx.isPointInPath) {
    this.drawMask(ctx);
    if (ctx.isPointInPath(mouseX, mouseY))
      this.active = true;
    else
      this.active = false;
  }
  return false;
};

// wrapper for the render method, memorizes the context
uv.Actor.prototype.render = function(ctx) {
  var that = this;
  
  if (!this.p('visible')) return;
  
  ctx.save();
  this.update();
  
  // initialize the transform matrix with property values
  var transform = new uv.Matrix2D();
  transform.translate(this.p('x'), this.p('y'));
  transform.rotate(this.p('rotation'));
  transform.scale(this.p('scaleX'), this.p('scaleY'));
  
  // apply the modification matrix to the dynamically initialized one
  transform.apply(this.matrix);
    
  ctx.transform(transform.elements[0], transform.elements[1], transform.elements[3], 
                transform.elements[4], transform.elements[2], transform.elements[5]);
  
  if (this.p('interactive')) {
    this.checkActive(ctx, this.scene.mouseX, this.scene.mouseY);
  }
  
  this.draw(ctx);
  
  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.render(ctx);
    });    
  }
  
  ctx.restore();
};