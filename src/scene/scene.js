// Scene
// =============================================================================

uv.Scene = function(properties) {
  var that = this;
  
  // super call
  uv.Actor.call(this, uv.extend({
    width: 0,
    height: 0,
    fillStyle: '',
    idleFramerate: 0,
    framerate: 50,
    traverser: uv.traverser.DepthFirst
  }, properties));
  
  
  this.mouseX = NaN;
  this.mouseY = NaN;
  
  // Keeps track of actors that capture mouse events
  this.interactiveActors = {};
  
  // Currently active actors (under cursor)
  this.activeActors = [];
  
  // Keep track of all Actors
  this.actors = {};
  
  // The scene property references the Scene an Actor belongs to
  this.scene = this;
  
  // Attached Displays
  this.displays = [];
  if (properties.displays) {
    uv.each(properties.displays, function(display) {
      that.displays.push(new uv.Display(that, display));
    });    
  }
  
  this.activeDisplay = this.displays[0];
  this.fps = 0;
  
  this.framerate = this.p('idleFramerate');
  
  // Commands hook in here
  this.commands = {};
  this.register(uv.cmds.RequestFramerate, {framerate: this.p('framerate')});
  
  // Register actors
  if (properties.actors) {
    uv.each(properties.actors, function(actorSpec) {
      that.add(actorSpec);
    });
  }
  
  var timeout;
  var requested = false;
  
  // Listen to interaction
  this.bind('interact', function() {
      if (!requested) {
        that.execute(uv.cmds.RequestFramerate);
        requested = true;
      }
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        requested = false;
        that.unexecute(uv.cmds.RequestFramerate);
      }, 1000);
  });
};

uv.Scene.prototype = uv.inherit(uv.Actor);

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
    this.interactiveActors[actor.id()] = actor;
  }
};

uv.Scene.prototype.start = function() {
  this.running = true;
  this.trigger('start');
  this.loop();
  this.checkActiveActors();
};

uv.Scene.prototype.setFramerate = function(framerate) {
  this.framerate = framerate;
  clearTimeout(this.nextLoop);
  clearTimeout(this.nextPick);
  this.loop();
  this.checkActiveActors();
};

// The draw loop

uv.Scene.prototype.loop = function() {
  var that = this,
      start, duration;
  
  if (this.running) {
    this.fps = (1000/duration < that.framerate) ? 1000/duration : that.framerate;
    start = new Date().getTime();
    this.render();
    duration = new Date().getTime()-start;
    if (this.framerate > 0) {
      this.nextLoop = setTimeout(function() { that.loop(); }, (1000/that.framerate)-duration);
    }
  }
};

uv.Scene.prototype.render = function() {
  this.trigger('frame');
  this.compileMatrix();
  this.refreshDisplays();
};

uv.Scene.prototype.stop = function(options) {
  this.running = false;
  this.trigger('stop');
};

uv.Scene.prototype.checkActiveActors = function() {
  var ctx = this.displays[0].ctx,
      that = this,
      prevActiveActors = this.activeActors;
  
  if (this.running) {
    if (this.scene.mouseX !== NaN) {
      
      this.activeActors = [];
      uv.each(this.interactiveActors, function(actor) {
        var active = actor.checkActive(ctx, that.scene.mouseX, that.scene.mouseY);
        if (active) {
          that.activeActors.push(actor);
          if (!uv.include(prevActiveActors, actor)) {
            actor.trigger('mouseover');
          }
        } else {
          if (uv.include(prevActiveActors, actor)) {
            actor.trigger('mouseout');
          }
        }
      });
    }
    if (that.framerate > 0) {
      this.nextPick = setTimeout(function() {
        that.checkActiveActors(); 
      }, 1000/Math.min(that.framerate, 15));
    }
  }
};


uv.Scene.prototype.refreshDisplays = function() {
  uv.each(this.displays, function(d) {
    d.compileMatrix();
    d.refresh();
  });
};

uv.Scene.prototype.display = function(display) {
  var d = new uv.Display(this, display);
  this.displays.push(d);
  return d;
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