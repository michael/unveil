// Dot
// =============================================================================

uv.Dot = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    radius: 20,
    strokeWeight: 2,
    strokeStyle: '#ccc',
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

uv.Dot.prototype = Object.extend(uv.Actor);

uv.Dot.prototype.draw = function(ctx) {
  ctx.fillStyle = this.p('fillStyle');
  
  ctx.beginPath();
  ctx.arc(0,0,this.p('radius'),0,Math.PI*2);
  ctx.closePath();
  ctx.fill();
};
