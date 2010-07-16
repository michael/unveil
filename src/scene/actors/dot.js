// Dot
//-----------------------------------------------------------------------------

uv.Dot = function(properties) {
  // super call
  uv.Actor.call(this);
  
  _.extend(this.properties, {
    radius: 20,
    strokeWeight: 2,
    strokeStyle: '#ccc'
  });
  
  _.extend(this.properties, properties);
};

uv.Dot.prototype = Object.extend(uv.Actor);

uv.Dot.prototype.draw = function(ctx) {
  // TODO: implement
  ctx.fillRect(0, 0, 20, 20);
};
