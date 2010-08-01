uv.Display = function(scene, opts) {
  this.scene = scene;

  this.$element = opts.container;
  this.$canvas = $('<canvas width="'+opts.width+'" ' +
                    'height="'+opts.height+'"></canvas>');
  
  this.width = opts.width;
  this.height = opts.height;
  
  this.$element.append(this.$canvas);
  this.ctx = this.$canvas[0].getContext("2d");
  
  this.matrix = new uv.Matrix2D();
  
  // attach behaviors
  if (opts.zooming) {
    this.zoombehavior = new uv.ZoomBehavior(this);
  }
  
  if (opts.paning) {
    this.panbehavior = new uv.PanBehavior(this);
  }
};

// udates the display (on every frame)
uv.Display.prototype.refresh = function() {
  var that = this;
  
  function mouseMove(e) {
    var mouseX, mouseY;
  
    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    }
        
    var mat = new uv.Matrix2D(that.matrix);
    mat.invert();
    
    var worldPos = mat.mult(new uv.Vector(mouseX, mouseY));
    var worldX = parseInt(worldPos.x);
    var worldY = parseInt(worldPos.y);

    that.mouseX = mouseX;
    that.mouseY = mouseY;
    
    that.scene.mouseX = worldX;
    that.scene.mouseY = worldY;
    
    that.scene.displayX = mouseX;
    that.scene.displayY = mouseY;
  }
  
  this.$canvas.bind('mousemove', mouseMove);
  
  // draw the scene
  this.ctx.clearRect(0,0, this.width,this.height);
  this.ctx.fillStyle = this.scene.prop('fillStyle');
  this.ctx.fillRect(0, 0, this.width, this.height);
  this.ctx.save();
  
  if (this.scene.all('children')) {
    this.scene.all('children').each(function(i, child) {
      child.render(that.ctx, that.matrix);
    });
  }
  
  this.ctx.restore();
};