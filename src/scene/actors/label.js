// Label
// =============================================================================
uv.Label = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    text: '',
    textAlign: 'start',
    font: '12px Helvetica, Arial',
    fillStyle: '#444',
    lineWidth: 0,
    backgroundStyle: '#eee',
    background: false
  }, properties));
};

uv.Actor.registeredActors.label = uv.Label;

uv.Label.prototype = uv.inherit(uv.Actor);

uv.Label.prototype.draw = function(ctx, tView) {
  ctx.font = this.p('font');
  
  ctx.textAlign = this.p('textAlign');
  ctx.fillText(this.p('text'), 0, 0);
};
