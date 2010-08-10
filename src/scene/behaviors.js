uv.ZoomBehavior = function(display) {
  function zoom(zoom, rx, ry) {
    display.tView.translate(rx, ry);
    display.tView.scale(zoom, zoom);
    display.tView.translate(-rx, -ry);
  }
  display.$canvas.bind('mousewheel', function(event, delta) {
    display.zoom += 0.02 * delta;
    zoom(1+0.02 * delta, display.scene.mouseX, display.scene.mouseY);
  });
};


uv.PanBehavior = function(display) {
  var paning = false,
      mouseX, mouseY,
      startX, startY,
      offsetX = 0,
      offsetY = 0,
      prevOffsetX = 0,
      prevOffsetY = 0;
  
  display.$canvas.bind('mousedown', function(event) {
    paning = true;
    startX = display.mouseX;
    startY = display.mouseY;
    prevOffsetX = 0;
    prevOffsetY = 0;
  });
  
  display.$canvas.bind('mouseup', function(event) {
    paning = false;
  });
  
  display.$canvas.bind('mousemove', function(event) {
    if (paning) {
      offsetX = display.mouseX-startX;
      offsetY = display.mouseY -startY;
      
      deltaX = offsetX - prevOffsetX;
      deltaY = offsetY - prevOffsetY;
      
      prevOffsetX = offsetX;
      prevOffsetY = offsetY;
      
      display.tView.translate(deltaX,deltaY);
    }
  });
};

