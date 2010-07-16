// Scene
//-----------------------------------------------------------------------------

uv.Scene = function(properties) {
  // super call
  uv.Actor.call(this);
  
  this.properties = {
    width: 0,
    height: 0
  };
  
  this.mouseX = 0;
  this.mouseY = 0;
  
  // keep track of that capture mouse events
  this.interactiveNodes = [];
  
  // the scene property references the scene an actor belongs to
  this.scene = this;
  
  // merge properties with default properties
  _.extend(this.properties, properties);
  
  this.$element = $("#canvas");
  this.$canvas = $('<canvas id="plotarea" width="'+this.properties.width+'" height="'+this.properties.height+'"></canvas>');
  
  this.$element.append(this.$canvas);
  this.ctx = this.$canvas[0].getContext("2d");
};

uv.Scene.prototype = Object.extend(uv.Actor);

uv.Scene.prototype.add = function(child) {
  child.setScene(this);
  
  uv.Actor.prototype.add.call(this, child);
  return child;
};

uv.Scene.prototype.add = function(child) {
  this.set('children', this.childCount+=1, child);
  
  // updates all childs that do not have a scene reference
  child.setScene(this)
  return child;
};

// draws the root panel
uv.Scene.prototype.render = function() {
  var that = this;
  
  function mouseMove(e) {
    var mouseX, mouseY;

    if (e.offsetX) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    } else if (e.layerX) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    }
    
    // console.log(mouseX);
    
    that.mouseX = mouseX;
    that.mouseY = mouseY;
    
    // TODO: check for interaction here rather than
    // doing it on every frame
    
    // _.each(that.interactiveNodes, function(n) {
    //   // apply transformations
    //   that.ctx.save();
    //   that.ctx.translate(n.properties.x, n.properties.y);
    //   n.checkActive(that.ctx, 110, 262);
    //   that.ctx.restore();
    // });
  }
  
  this.$canvas.bind('mousemove', mouseMove);
  
  // TODO: remove
  this.ctx.clearRect(0,0, 10000,10000);
  
  if (this.all('children')) {
    this.all('children').each(function(i, child) {
      child.render(that.ctx);
    });    
  }
};

uv.Scene.prototype.start = function(options) {
  var opts = _.extend({framerate: 60}, options),
      that = this;
  setInterval(function() { that.scene.render(); }, 1000/opts.framerate);
};