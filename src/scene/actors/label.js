// Label
// =============================================================================
uv.Label = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
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

uv.Label.prototype = Object.extend(uv.Actor);

uv.Label.prototype.draw = function(ctx) {
  ctx.font = this.p('font');
  // Draw the label on a background rectangle
  if (this.p('background')) {
    var textWidth = ctx.measureText(this.p('text')).width;
    
    ctx.fillStyle = this.p('backgroundStyle');

    function roundedRect(ctx, x, y, width, height, radius, stroke) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (stroke)
        ctx.stroke();
      ctx.fill();
    }
    
    var x, y, width, height;
    
    if (this.p('textAlign') == 'start') {
      x = -5; y = -13;
      width = textWidth+10;
      height = 20;
    } else if (this.p('textAlign') == 'center') {
      x = -textWidth/2-5; y = -13;
      width = textWidth+10;
      height = 20;
    } else if (this.p('textAlign') == 'right') {
      x = -textWidth-5; y = -13;
      width = textWidth+10;
      height = 20;
    }
    
    roundedRect(ctx, x, y, width, height, 5, this.p('lineWidth') > 0);
  }
  
  ctx.textAlign = this.p('textAlign');
  ctx.fillText(this.p('text'), 0, 0);
};
