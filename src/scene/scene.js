// Scene
// =============================================================================

uv.Scene = function(properties) {
  var that = this;
  
  // super call
  uv.Actor.call(this, properties);
  
  _.extend(this.properties, {
    width: 0,
    height: 0,
    fillStyle: '#fff',
    framerate: 10,
    traverser: uv.traverser.DepthFirst
  }, properties);
  
  this.mouseX = NaN;
  this.mouseY = NaN;
  
  // Keeps track of actors that capture mouse events
  this.interactiveActors = [];
  
  // Currently active actors (under cursor)
  this.activeActors = [];
  
  // Keep track of all Actors
  this.actors = {};
  
  // The scene property references the Scene an Actor belongs to
  this.scene = this;
  
  // Attached Displays
  this.displays = [];
  _.each(properties.displays, function(display) {
    that.displays.push(new uv.Display(that, display));
  });
  
  this.activeDisplay = this.displays[0];
  
  this.fps = 0;
  this.framerate = this.p('framerate');
  
  // Commands hook in here
  this.commands = {};
  this.register(uv.cmds.RequestFramerate, {framerate: 60});
  
  // Register actors
  if (properties.actors) {
    _.each(properties.actors, function(actorSpec) {
      that.add(actorSpec);
    });
  }
};

uv.Scene.prototype = Object.extend(uv.Actor);


uv.Scene.prototype.registerActor = function(actor) {
  var id = actor.id();
  if (this.actors[id])
    throw "ID '" + id + "' already registered.";
  
  // Set the scene reference
  actor.scene = this;
  
  // Register actor in scene space
  this.actors[id] = actor;
  
  // Register as interactive
  if (actor.p('interactive')) {
    this.interactiveActors.push(actor);
  }
};


uv.Scene.prototype.get = function(key) {
  return this.actors[key];
};


uv.Scene.prototype.start = function(options) {
  var that = this,
      opts = { framerate: 50, idleFramerate: 10 };
      
  _.extend(opts, options);
  this.running = true;
  this.trigger('start');
  this.loop();
  this.checkActiveActors();
};


// The draw loop

uv.Scene.prototype.loop = function() {
  var that = this,
      start, duration;
  
  if (this.running) {
    start = new Date().getTime();
    this.trigger('frame');
    this.compileMatrix();
    this.refreshDisplays();
    duration = new Date().getTime()-start;
    
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
  }
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
  this.trigger('stop');
};

uv.Scene.prototype.traverse = function() {
  return this.properties.traverser(this);
};

uv.Scene.prototype.checkActiveActors = function() {
  var ctx = this.displays[0].ctx,
      that = this,
      prevActiveActors = this.activeActors;
  
  if (this.running) {
    if (this.scene.mouseX !== NaN) {
      
      this.activeActors = [];
      _.each(this.interactiveActors, function(actor) {
        var active = actor.checkActive(ctx, that.scene.mouseX, that.scene.mouseY);
        if (active) {
          that.activeActors.push(actor);
          if (!_.include(prevActiveActors, actor)) {
            actor.trigger('mouseover');
          }
        } else {
          if (_.include(prevActiveActors, actor)) {
            actor.trigger('mouseout');
          }
        }
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
};

uv.Scene.prototype.unexecute = function(cmd) {
  this.commands[cmd.className].unexecute();
};