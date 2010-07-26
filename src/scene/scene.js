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
  
  // attached displays
  this.displays = [];
  
  this.fps = 0;
  this.framerate = this.p('framerate');
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

// walks the scene graph in depth-first order and compiles
// transformation matrices per object.
uv.Scene.prototype.preRender = function() {
  // TODO: implement
}

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
    
    this.refreshDisplays();
    
    duration = new Date().getTime()-start;
    
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
  }
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
};

// creates a display to make the scene visible
uv.Scene.prototype.display = function(options) {
  var disp = new uv.Display(this, options);
  this.displays.push(disp);
  
  return disp;
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

// Refresh displays
uv.Scene.prototype.refreshDisplays = function() {
  _.each(this.displays, function(d) {
    d.refresh();
  });
};


