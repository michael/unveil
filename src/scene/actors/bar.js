// Bar - interactive bar, that can receive a modified height etc.
//-----------------------------------------------------------------------------

uv.Bar = function(properties) {
  // super call
  uv.Actor.call(this);
  
  _.extend(this.properties, {
    width: 30,
    height: 50,
    strokeWeight: 2,
    strokeStyle: '#000',
    fillStyle: '#ccc'
  }, properties);
  
  this.t = new Tween(this.properties, "height", Tween.strongEaseInOut, this.properties.height, this.properties.height+50, 2);
};

uv.Bar.prototype = Object.extend(uv.Actor);

uv.Bar.prototype.updateHeight = function(newHeight) {
  this.t.continueTo(newHeight, 1.5);
};

uv.Bar.prototype.update = function() {
  this.t.tick();
};

uv.Bar.prototype.drawMask = function(ctx) {
  ctx.beginPath();
  
  ctx.moveTo(0, 0);
  ctx.lineTo(this.properties.width+2, 0);
  ctx.lineTo(this.properties.width+2, this.properties.height);
  ctx.lineTo(0, this.properties.height);
  ctx.lineTo(0, 0);
  
  // uncomment the following lines to make the mask visible
  // ctx.fillStyle = "#f00";
  // ctx.fill();
};

uv.Bar.prototype.draw = function(ctx) {
  ctx.fillStyle = this.prop('fillStyle');
  ctx.fillRect(0, 0, this.prop('width'), this.prop('height'));
};