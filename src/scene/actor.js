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
    fillStyle: '#000',
    strokeStyle: '#000',
    visible: true
  }, properties);
  
  this.replace('children', new uv.SortedHash());
  
  // Under mouse cursor
  this.active = false;
  
  // The modification matrix
  // Works like a regular transformation matrix, with the difference
  // that it doesn't describe the whole transformation to be applied.
  // The render() method first applies the current properties 
  // (x, y, scaleX, scaleY) followed by modification matrix.
  this.matrix = new uv.Matrix2D();
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


// Matrix transformations
// -----------------------------------------------------------------------------
// 
// You have full control about the current transformation matrix. Be aware that
// Actor properties like x, y, scaleX, scaleY, rotation are applied in the first
// place. After that this modification matrix is applied. It's good practice to
// not specify any properties when working with the modification matrix. By doing
// so you can treat the modification matrix as the actual transformation matrix.
// 
// Destructive operations
// .............................................................................
//
// Those methods all reset the modification matrix for now. So you can't combine
// setScale() and setRotation()


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
// Those methods can be chained together. The Modification Matrix is updated
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
  var p = new uv.Vector(mouseX,mouseY),
      transform = new uv.Matrix2D(this.tmatrix);
  
  pnew = transform.inverse().mult(p);
  mouseX = pnew.x;
  mouseY = pnew.y;
  
  if (this.drawMask && ctx.isPointInPath) {
    this.drawMask(ctx);
    if (ctx.isPointInPath(mouseX, mouseY))
      this.active = true;
    else
      this.active = false;
  }
  return false;
};

// Precompile the Transformation Matrix

uv.Actor.prototype.preRender = function() {
  // Start with the parent matrix
  if (this.parent) {
    this.tmatrix = new uv.Matrix2D(this.parent.tmatrix);
  } else {
    this.tmatrix = new uv.Matrix2D();
  }
  
  this.update();
  this.tmatrix.translate(this.p('x'), this.p('y'));
  this.tmatrix.rotate(this.p('rotation'));
  this.tmatrix.scale(this.p('scaleX'), this.p('scaleY'));
  
  // Apply the Modification Matrix to the dynamically initialized one
  this.tmatrix.apply(this.matrix);
  
  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.preRender();
    });
  }
};

// Draws the Actor to a Display

uv.Actor.prototype.render = function(ctx, view) {
  var that = this;
  
  if (!this.p('visible')) return;
  
  // Apply the view transformation
  var transform = new uv.Matrix2D(view);
  
  // Apply the Actors Transformation Matrix
  transform.apply(this.tmatrix);
  ctx.setTransform(transform.elements[0], transform.elements[1], transform.elements[3], 
                   transform.elements[4], transform.elements[2], transform.elements[5]);
  this.draw(ctx);
};