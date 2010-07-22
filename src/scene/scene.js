// Scene
// =============================================================================

uv.Scene = function(properties) {
  // super call
  uv.Actor.call(this);
  
  _.extend(this.properties, {
    width: 0,
    height: 0,
    fillStyle: '#fff',
    element: '#canvas',
    framerate: 10
  }, properties);
  
  this.mouseX = -1;
  this.mouseY = -1;
  
  // keeps track of nodes that capture mouse events
  this.interactiveNodes = [];
  
  // the scene property references the scene an actor belongs to
  this.scene = this;
  
  // commands hook in here
  this.commands = {};
  
  this.fps = 0;
  this.framerate = this.p('framerate');
  
  this.$element = $(this.p('element'));
  this.$canvas = $('<canvas id="plotarea" width="'+this.properties.width+'" ' +
                    'height="'+this.properties.height+'"></canvas>');
  
  this.$element.append(this.$canvas);
  this.ctx = this.$canvas[0].getContext("2d");
};

uv.Scene.prototype = Object.extend(uv.Actor);

uv.Scene.prototype.add = function(child) {
  child.setScene(this);
  
  uv.Actor.prototype.add.call(this, child);
  return child;
};

uv.Scene.prototype.add = function(child) {
  this.set('children', this.childCount+=1, child);
  
  // updates all childs that do not have a scene reference
  child.setScene(this);
  return child;
};

// draws the root panel
uv.Scene.prototype.render = function() {
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
    
    that.mouseX = mouseX;
    that.mouseY = mouseY;
  }
  
  this.$canvas.bind('mousemove', mouseMove);
  
  // draw the scene
  this.ctx.clearRect(0,0, this.properties.width,this.properties.height);
  this.ctx.fillStyle = this.prop('fillStyle');
  this.ctx.fillRect(0, 0, this.properties.width, this.properties.height);

  this.ctx.save();

  // initialize the transform matrix with property data
  var transform = new uv.Matrix2D();
  transform.translate(this.p('x'), this.p('y'));
  transform.rotate(this.p('rotation'));
  transform.scale(this.p('scaleX'), this.p('scaleY'));
  
  // apply the modification matrix to the dynamically initialized one
  transform.apply(this.matrix);
    
  this.ctx.transform(transform.elements[0], transform.elements[1], transform.elements[3], 
                transform.elements[4], transform.elements[2], transform.elements[5]);
  
  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.render(that.ctx);
    });
  }
  this.ctx.restore();
};

uv.Scene.prototype.start = function(options) {
  var that = this,
      opts = { framerate: 50, idleFramerate: 10 };
      
  _.extend(opts, options);
  this.running = true;
  this.loop();
};

// the draw loop
uv.Scene.prototype.loop = function() {
  var that = this,
      start, duration;
  
  if (this.running) {
    start = new Date().getTime();
    this.scene.render();
    duration = new Date().getTime()-start;
    
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
  }
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
};

// Commands
// -----------------------------------------------------------------------------

// command construction and registration
uv.Scene.prototype.register = function(cmd, options) {
  this.commands[cmd.className] = new cmd(this, options);
};

uv.Scene.prototype.execute = function(cmd) {
  this.commands[cmd.className].execute();
}

uv.Scene.prototype.unexecute = function(cmd) {
  this.commands[cmd.className].unexecute();
}