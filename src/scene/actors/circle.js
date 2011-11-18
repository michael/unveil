// Circle
// =============================================================================

uv.Circle = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    radius: 20,
    strokeWeight: 2,
    lineWidth: 0,
    strokeStyle: '#fff'
  }, properties));
};

uv.Actor.registeredActors.circle = uv.Circle;

uv.Circle.prototype = uv.inherit(uv.Actor);

uv.Circle.prototype.bounds = function() {
  return [
    { x: -this.p('radius'), y: -this.p('radius') },
    { x: this.p('radius'),  y: -this.p('radius') },
    { x: this.p('radius'),  y: this.p('radius') },
    { x: -this.p('radius'), y: this.p('radius') }
  ];
};

uv.Circle.prototype.draw = function(ctx, tView) {  
  ctx.fillStyle = this.p('fillStyle');
  ctx.strokeStyle = this.p('strokeStyle');
  ctx.lineWidth = this.p('lineWidth');
  
  ctx.beginPath();
  ctx.arc(0,0,this.p('radius'),0,Math.PI*2, false);
  ctx.closePath();
  if (this.p('lineWidth') > 0) {
    ctx.stroke();
  }
  ctx.fill();
};
