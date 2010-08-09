// Scene
// =============================================================================

uv.Scene = function(properties) {
  var that = this;
  
  // super call
  uv.Actor.call(this);
  
  _.extend(this.properties, {
    width: 0,
    height: 0,
    fillStyle: '#fff',
    element: '#canvas',
    framerate: 10,
    traverser: uv.traverser.DepthFirst
  }, properties);
  
  this.mouseX = NaN;
  this.mouseY = NaN;
  
  // Keeps track of actors that capture mouse events
  this.interactiveActors = [];
  
  // The scene property references the Scene an Actor belongs to
  this.scene = this;
  
  // Commands hook in here
  this.commands = {};
  
  // Attached Displays
  this.displays = [];
  _.each(properties.displays, function(display) {
    that.displays.push(new uv.Display(that, display));
  });
  
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

uv.Scene.prototype.start = function(options) {
  var that = this,
      opts = { framerate: 50, idleFramerate: 10 };
      
  _.extend(opts, options);
  this.running = true;
  this.loop();
  this.checkActiveActors();
};

// the draw loop
uv.Scene.prototype.loop = function() {
  var that = this,
      start, duration;
  
  if (this.running) {
    start = new Date().getTime();
    
    this.preRender();
    this.refreshDisplays();
    
    duration = new Date().getTime()-start;
    
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
  }
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
};

uv.Scene.prototype.traverse = function() {
  return this.properties.traverser(this);
};

uv.Scene.prototype.checkActiveActors = function() {
  var ctx = this.displays[0].ctx,
      that = this;
  
  if (this.running) {
    if (this.scene.mouseX !== NaN) {
      _.each(this.interactiveActors, function(actor) {
        actor.checkActive(ctx, that.scene.mouseX, that.scene.mouseY);
      });
    }
    setTimeout(function() { that.checkActiveActors(); }, (1000/10));
  }
};


uv.Scene.prototype.refreshDisplays = function() {
  _.each(this.displays, function(d) {
    d.refresh();
  });
};

// Commands
// -----------------------------------------------------------------------------

uv.Scene.prototype.register = function(cmd, options) {
  this.commands[cmd.className] = new cmd(this, options);
};

uv.Scene.prototype.execute = function(cmd) {
  this.commands[cmd.className].execute();
}

uv.Scene.prototype.unexecute = function(cmd) {
  this.commands[cmd.className].unexecute();
}