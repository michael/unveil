// Bar
// =============================================================================

uv.Bar = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    width: 30,
    height: 50,
    strokeWeight: 2,
    strokeStyle: '#000',
    fillStyle: '#ccc'
  }, properties));
};

uv.Bar.prototype = Object.extend(uv.Actor);

uv.Bar.prototype.drawMask = function(ctx) {
  ctx.beginPath();
  
  ctx.moveTo(0, 0);
  ctx.lineTo(this.properties.width, 0);
  ctx.lineTo(this.properties.width, this.properties.height);
  ctx.lineTo(0, this.properties.height);
  ctx.lineTo(0, 0);
  ctx.closePath();
};

uv.Bar.prototype.draw = function(ctx) {
  ctx.fillStyle = this.prop('fillStyle');
  ctx.fillRect(0, 0, this.prop('width'), this.prop('height'));
};
