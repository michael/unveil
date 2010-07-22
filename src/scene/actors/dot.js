// Dot
// =============================================================================

uv.Dot = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    radius: 20,
    strokeWeight: 2,
    strokeStyle: '#ccc'
  }, properties));
};

uv.Dot.prototype = Object.extend(uv.Actor);

uv.Dot.prototype.draw = function(ctx) {

};
