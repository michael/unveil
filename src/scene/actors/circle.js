// Circle
// =============================================================================

uv.Circle = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    radius: 20,
    strokeWeight: 2,
    lineWidth: 3,
    strokeStyle: '#fff',
    bounds: function() {
      return [
        { x: -this.p('radius'), y: -this.p('radius') },
        { x: this.p('radius'),  y: -this.p('radius') },
        { x: this.p('radius'),  y: this.p('radius') },
        { x: -this.p('radius'), y: this.p('radius') }
      ];
    }
  }, properties));
};

uv.Circle.prototype = Object.extend(uv.Actor);

uv.Circle.prototype.draw = function(ctx) {
  ctx.fillStyle = this.p('fillStyle');
  ctx.strokeStyle = this.p('strokeStyle');
  ctx.lineWidth = this.p('lineWidth');
  
  ctx.beginPath();
  ctx.arc(0,0,this.p('radius'),0,Math.PI*2, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};
