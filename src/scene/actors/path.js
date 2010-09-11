// Path
// =============================================================================

uv.Path = function(properties) {
  // super call
  uv.Actor.call(this, uv.extend({
    points: [],
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: ''
  }, properties));
  
  this.transformedPoints = this.points = [].concat(this.p('points'));
};

uv.Actor.registeredActors.path = uv.Path;

uv.Path.prototype = uv.inherit(uv.Actor);

uv.Path.prototype.transform = function(ctx, tView) {
  this.transformedPoints = this.points = [].concat(this.p('points'));
  if (this.p('transformMode') === 'origin') {
    var m = this.tShape().concat(tView).concat(this._tWorld);
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.transformedPoints = this.points.map(function(p) {
      var tp   = m.transformPoint(p),
          tcp1 = m.transformPoint(uv.Point(p.cp1x, p.cp1y)),
          tcp2 = m.transformPoint(uv.Point(p.cp2x, p.cp2y)),
          result;
      result = {x: tp.x, y: tp.y};
      if (p.cp1x && p.cp1y) {
        result.cp1x = tcp1.x;
        result.cp1y = tcp1.y;        
      }
      if (p.cp2x && p.cp2y) {
        result.cp2x = tcp2.x;
        result.cp2y = tcp2.y;        
      }
      return result;
    });
  } else {
    uv.Actor.prototype.transform.call(this, ctx, tView);
  }
};


uv.Path.prototype.draw = function(ctx, tView) {  
  var points = [].concat(this.transformedPoints),
      v;
  
  if (points.length >= 1) {
    ctx.beginPath();
    v = points.shift();
    ctx.moveTo(v.x, v.y);
    while (v = points.shift()) {
      if (v.cp1x && v.cp2x) {
        ctx.bezierCurveTo(v.cp1x, v.cp1y, v.cp2x,v.cp2y, v.x, v.y);
      } else if (v.cp1x) {
        ctx.quadraticCurveTo(v.cp1x, v.cp1y, v.x, v.y);
      } else {
        ctx.lineTo(v.x, v.y);
      }
    }
    if (this.p('lineWidth') > 0 && this.p('strokeStyle') !== '') {
      ctx.stroke();
    }
    
    if (this.p('fillStyle') !== '') {
      ctx.fill();
    }
    ctx.closePath();
  }
};
