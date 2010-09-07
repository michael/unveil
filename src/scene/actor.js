// Actor - Graphical object to be attached to the scene graph
// =============================================================================

uv.Actor = function(properties) {
  uv.Node.call(this);
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
    visible: true
  }, properties);
  
  // init children
  this.replace('children', new uv.SortedHash());
  
  // Init motion tween container
  this.tweens = {};
  
  // Under mouse cursor
  this.active = false;
  
  // Event handlers
  this.handlers = {};
};

// Registration point for custom actors
uv.Actor.registeredActors = {};

uv.Actor.prototype = uv.inherit(uv.Node);


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
    this.all('children').each(function(index, child) {
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

uv.Actor.prototype.animate = function(property, value, duration, easer) {
  var scene = this.scene;
  
  if (!this.tweens[property]) {
    this.tweens[property] = new uv.Tween({
      obj: this.properties,
      property: property,
      duration: duration || 1000
    });
    
    // Request a higher framerate for the transition
    // and release it after completion.
    if (scene.commands.RequestFramerate) {
      this.tweens[property].bind('start', function() {
        scene.execute(uv.cmds.RequestFramerate);
      });
      this.tweens[property].bind('finish', function() {
        scene.unexecute(uv.cmds.RequestFramerate);
      });      
    }
  }
  
  if (easer) {
    this.tweens[property].easer = uv.Tween[easer];
  }
  this.tweens[property].continueTo(value, duration || 1000);
  return this.tweens[property];
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
    this.all('children').each(function(i, child) {
      child.compileMatrix();
    });
  }
};


// Drawing, masking and rendering
// -----------------------------------------------------------------------------

uv.Actor.prototype.update = function() {
  // Update motion tweens
  for (var key in this.tweens) {
    this.tweens[key].tick();
  }
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
  if (this.p('transformMode') === 'coords') {
    // Extract the translation of the matrix
    t = m.transformPoint(uv.Point(0,0));
    ctx.setTransform(1, 0, 0, 1, t.x, t.y);
  } else {
    ctx.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
  }
};