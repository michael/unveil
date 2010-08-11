uv.Display = function(scene, opts) {
  var that = this;
  
  this.scene = scene;

  this.$element = opts.container;
  this.$canvas = $('<canvas width="'+opts.width+'" ' +
                    'height="'+opts.height+'" style="position: relative;"></canvas>');
  
  this.width = opts.width;
  this.height = opts.height;
  
  this.$element.append(this.$canvas);
  this.ctx = this.$canvas[0].getContext("2d");
  
  this.tView = new uv.Matrix2D();
  
  // Provides access to the current zoom value
  this.zoom = 1;
  
  // attach behaviors
  if (opts.zooming) {
    this.zoombehavior = new uv.ZoomBehavior(this);
  }
  
  if (opts.paning) {
    this.panbehavior = new uv.PanBehavior(this);
  }
  
  // Callbacks
  this.callbacks = {};
  this.callbacks.viewChange = function() { };
  
  // Register mouse events
  function mouseMove(e) {
    var mat = new uv.Matrix2D(that.tView),
        pos;
    
    mat.invert();
    if (e.offsetX) {
      pos = new uv.Vector(e.offsetX, e.offsetY);
    } else if (e.layerX) {
      pos = new uv.Vector(e.layerX, e.layerY);
    }
    
    that.mouseX = pos.x;
    that.mouseY = pos.y;    
    
    worldPos = mat.mult(pos);
    that.scene.mouseX = parseInt(worldPos.x, 10);
    that.scene.mouseY = parseInt(worldPos.y, 10);
    
    that.scene.activeDisplay = that;
  }
  
  this.$canvas.bind('mousemove', mouseMove);
  this.$canvas.bind('mouseout', function() {
    that.scene.mouseX = NaN;
    that.scene.mouseY = NaN;
  });
};

// Register callbacks
uv.Display.prototype.on = function(name, fn) {
  this.callbacks[name] = fn;
};

// Convert world pos to display pos

uv.Display.prototype.displayPos = function(pos) {
  return this.tView.mult(pos);
};

// Convert display pos to world pos

uv.Display.prototype.worldPos = function(pos) {
  return this.tView.inverse().mult(pos);
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
  _.each(that.actors, function(actor, index) {
    actor.render(that.ctx, that.tView);
  });
  
  this.ctx.restore();
};