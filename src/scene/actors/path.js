// Path
// =============================================================================

uv.Path = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    points: [],
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: null
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
      if (v.cp1x && v.cp2x) {
        ctx.bezierCurveTo(v.cp1x, v.cp1y, v.cp2x,v.cp2y, v.x, v.y);
      } else if (v.cp1x) {
        ctx.quadraticCurveTo(v.cp1x, v.cp1y, v.x, v.y);
      } else {
        ctx.lineTo(v.x, v.y);
      }
    }
    
    if (this.p('fillStyle')) {
      ctx.fill();
    }
    if (this.p('strokeStyle')) {
      ctx.stroke();
    }
    
    ctx.closePath();
  }
};