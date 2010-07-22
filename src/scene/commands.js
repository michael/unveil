// Commands
// =============================================================================
// 
// Commands are used to modify properties on the scene. They can be executed
// one or many times, and they can be unexecuted to recover the original state

uv.cmds = {};

uv.cmds.RequestFramerate = function(scene, opts) {
  this.scene = scene;
  this.requests = 0;
  this.framerate = opts.framerate;
  this.originalFramerate = this.scene.framerate;
};

uv.cmds.RequestFramerate.className = 'RequestFramerate';

uv.cmds.RequestFramerate.prototype.execute = function() {
  this.requests += 1;
  this.scene.framerate = this.framerate;
};

uv.cmds.RequestFramerate.prototype.unexecute = function() {
  this.requests -= 1;
  if (this.requests <= 0) {
    this.scene.framerate = this.originalFramerate;
  }
};