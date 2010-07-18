// Actor - Graphical object to be attached to the scene graph
//-----------------------------------------------------------------------------

uv.Actor = function() {
  uv.Node.call(this);
  
  this.childCount = 0;
  
  // default actor properties
  this.properties = {
    x: 0,
    y: 0,
    fillStyle: '#000',
    strokeStyle: '#000'
  };
  
  this.active = false;
};

uv.Actor.prototype = Object.extend(uv.Node);

// evaluates a property (in case of a function
// the result of the function is returned)
uv.Actor.prototype.prop = function(property, value) {
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

// alias
uv.Actor.prototype.p = uv.Actor.prototype.prop;

// recursively sets the scene reference to itself and
// all childs
uv.Actor.prototype.setScene = function(scene) {
  this.scene = scene;

  // register as an interactive node on the scene
  // if the user explicitly declares the node as
  // interactive (means he wants to activate mouse-interaction)
  if (this.properties.interactive) {
    scene.interactiveNodes.push(this);
  }
  
  if (this.all('children')) {
    this.all('children').each(function(index, child) {
      child.setScene(scene);
    });
  }
};

uv.Actor.prototype.add = function(child) {
  this.set('children', this.childCount+=1, child);
  child.parent = this;
  return child;
};

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
  ctx.save();
  
  this.update();
  
  // do transformations
  // TODO use a transformation matrix
  ctx.translate(this.properties.x, this.properties.y);
  
  if (this.properties.interactive) {
    this.checkActive(ctx, this.scene.mouseX, this.scene.mouseY);
  }
  
  // render
  this.draw(ctx);
  
  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.render(ctx);
    });    
  }
  
  ctx.restore();
};