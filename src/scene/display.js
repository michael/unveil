uv.Display = function(scene, opts) {
  var that = this;
  
  this.scene = scene;
  this.element = document.getElementById(opts.container);
  this.canvas = document.createElement("canvas");
  this.canvas.setAttribute('width', opts.width);
  this.canvas.setAttribute('height', opts.height);
  this.canvas.style.position = 'relative';
  this.element.appendChild(this.canvas);

  this.width = opts.width;
  this.height = opts.height;
  
  this.bounded = opts.bounded || true;
  
  this.ctx = this.canvas.getContext("2d");
  
  this.tView = uv.Matrix();
  
  // attach behaviors
  if (opts.zooming) {
    this.zoombehavior = new uv.behaviors.Zoom(this);
  }
  
  if (opts.panning) {
    this.panbehavior = new uv.behaviors.Pan(this);
  }
  
  // Callbacks
  this.callbacks = {};
  this.callbacks.viewChange = function() { };
  
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

// Register callbacks
uv.Display.prototype.on = function(name, fn) {
  this.callbacks[name] = fn;
};

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
  var dx = Math.max(0, this.scene.p('width')-this.width),
      dy = Math.max(0, this.scene.p('width')-this.width);
  
  return {
      x: (1 - this.tView.a) * this.width - this.tView.a*dx,
      y: (1 - this.tView.a) * this.height - this.tView.a*dy
  };
};

// Updates the display (on every frame)

uv.Display.prototype.refresh = function() {
  var that = this;
  
  // draw the scene
  this.ctx.clearRect(0,0, this.width,this.height);
  this.ctx.fillStyle = this.scene.p('fillStyle');
  this.ctx.fillRect(0, 0, this.width, this.height);
  this.ctx.save();
  
  that.actors = this.scene.traverse();
  that.actors.shift();
  uv.each(that.actors, function(actor, index) {
    actor.render(that.ctx, that.tView);
  });
  
  this.ctx.restore();
};