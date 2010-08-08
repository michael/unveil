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

uv.Bar.prototype.drawMask = function(ctx, x, y) {
  x = 0;
  y = 0;
  
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+this.properties.width, y);
  ctx.lineTo(x+this.properties.width, y+this.properties.height);
  ctx.lineTo(x, y+this.properties.height);
  ctx.lineTo(x, y);
  ctx.closePath();
};

uv.Bar.prototype.draw = function(ctx) {
  ctx.fillStyle = this.prop('fillStyle');
  ctx.fillRect(0, 0, this.prop('width'), this.prop('height'));
};
