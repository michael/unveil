// Rect
// =============================================================================

uv.Rect = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    width: 0,
    height: 0,
    fillStyle: '#777',
    strokeStyle: '#000',
    lineWidth: 0
  }, properties));
};

uv.Actor.registeredActors.rect = uv.Rect;

uv.Rect.prototype = uv.extend(uv.Actor);

uv.Rect.prototype.bounds = function() {
  return [
    { x: 0, y: 0 },
    { x: this.p('width'), y: 0 },
    { x: this.p('width'), y: this.p('height') },
    { x: 0, y: this.p('height') }
  ];
};

uv.Rect.prototype.draw = function(ctx, tView) {
  if (this.p('fillStyle')) {
    ctx.fillRect(0, 0, this.p('width'), this.p('height'));
  }
  
  if (this.p('lineWidth') > 0) {
    ctx.strokeRect(0, 0, this.p('width'), this.p('height'));
  }
};
