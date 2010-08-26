// Path
// =============================================================================

uv.Path = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    points: [],
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: '#ccc'
  }, properties));
};

uv.Actor.registeredActors.path = uv.Path;

uv.Path.prototype = Object.extend(uv.Actor);

uv.Path.prototype.draw = function(ctx) {
  var points = [].concat(this.p('points')),
      v;
  
  if (this.p('points').length >= 1) {
    ctx.beginPath();
    v = points.shift();
    ctx.moveTo(v.x, v.y);
    
    while (v = points.shift()) {
      ctx.lineTo(v.x, v.y);
    }
    ctx.strokeStyle = this.p('strokeStyle');
    ctx.stroke();
  }
};
