// Label
//-----------------------------------------------------------------------------

uv.Label = function(properties) {
  // super call
  uv.Actor.call(this);
  
  _.extend(this.properties, {
    text: '',
    textAlign: 'start',
    font: '12px Helvetica, Arial'
  });
  
  _.extend(this.properties, properties);
};

uv.Label.prototype = Object.extend(uv.Actor);

uv.Label.prototype.draw = function(ctx) {
  
  ctx.font = this.prop('font');
  ctx.fillStyle = this.prop('fillStyle');
  
  ctx.textAlign = this.prop('textAlign');
  ctx.fillText(this.prop('text'), 0, 0);
};
