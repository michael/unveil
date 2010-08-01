uv.Scatterplot = uv.Visualization.extend({
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    
    this.margin = {top: 30, right: 0, bottom: 50, left: 150};
    this.itemValueIndex = 0;
    
    var that = this;
    
    var xProp = this.collection.get("properties", this.measures[0]);
        
    if (xProp.unique === false) {
      // TODO check
      var $settings = $('<div class="settings"><h4>Time</h4><input id="item_value_index" type="range" min="0" max="'+(xProp.categories.length-1)+'" value="'+this.itemValueIndex+'"><br/><h2 id="current-category">'+xProp.categories[this.itemValueIndex]+'</span></h2>');
      
      $('#info').append($settings);
      // this.$canvas.append($settings);
      
      $('#item_value_index').change(function() {
        if (that.itemValueIndex !== $(this).val()) {
          that.itemValueIndex = $(this).val();
          $('#current-category').html(xProp.categories[that.itemValueIndex]);
          that.render();
        }
      });
    }
  },
  render: function() {
    var that = this;
    
    if (!this.isValid()) {
      this.$canvas.html('Cannot render. Change your settings.');
      return;
    }
    
    // for some reason if I don't do this there's strange
    // rendering behavior in google chrome    
    setTimeout(function() {
      that.renderChart();
    }, 1);
  },
  renderChart: function() {
    var that = this,
        width = this.$canvas.width()-this.margin.left-this.margin.right-200,
        height = this.$canvas.height()-this.margin.top-this.margin.bottom-20,
        xProp = this.collection.get("properties", this.measures[0]),
        yProp = this.collection.get("properties", this.measures[1]),
        zProp = this.collection.get("properties", this.measures[2]),
        xMin = xProp.aggregate(uv.Aggregators.MIN),
        xMax = xProp.aggregate(uv.Aggregators.MAX),
        yMin = yProp.aggregate(uv.Aggregators.MIN),
        yMax = yProp.aggregate(uv.Aggregators.MAX),
        zMin,
        zMax,
        x, y, z, items,
        formatter = pv.Format.number();
    
    /* Sizing parameters and scales. */
    x = pv.Scale.linear(xMin, xMax).range(0, width).nice();
    y = pv.Scale.linear(yMin, yMax).range(0, height).nice();
    
    if (zProp) { // encode 3rd measure as dot size
      zMin = zProp.aggregate(uv.Aggregators.MIN),
      zMax = zProp.aggregate(uv.Aggregators.MAX),
      z = pv.Scale.linear(zMin, zMax).range(5, 15);
    }

    var items = this.collection.all("items").values();
    
    var colors = pv.Scale.ordinal(_.map(items, function(i) { return i.key }))
                        .range('#8DB5C8', '#808E89', '#B16649', '#90963C', '#A2C355', '#93BAA1', '#86A2A9')
    
    
    /* The root panel. */
    var vis = new pv.Panel()
      .width(width).height(height)
      .bottom(this.margin.bottom).top(this.margin.top)
      .left(this.margin.left).right(this.margin.right)
      .strokeStyle('#ccc')
      .canvas(this.$canvas[0]);    

    /* X-axis and ticks. */
    vis.add(pv.Rule)
        .data(function() { return x.ticks(); })
        .strokeStyle(function(d) {return d ? "#eee" : "#999"; })
        .left(function(d) { return parseInt(x(d), 10)+0.5; })
      .anchor("bottom").add(pv.Label)
        .text(x.tickFormat)
        .textStyle("#777")
        .font('11px Helvetica');

    /* Y-axis and ticks. */
    vis.add(pv.Rule)
        .data(function() { return y.ticks(); })
        .strokeStyle(function(d) { return d ? "#eee" : "#999"; })
        .bottom(function(d) { return parseInt(y(d), 10)+0.5; })
      .anchor("left").add(pv.Label)
        .text(y.tickFormat)
        .textStyle("#777")
        .font('11px Helvetica');

    // xAxis Name
    vis.add(pv.Label)
      .text(xProp.name)
      .left(width/2)
      .bottom(-35)
      .textStyle('#555')
      .font('bold 14px Helvetica');

    // yAxis Name
    vis.add(pv.Label)
      .text(yProp.name)
      .left(-110)
      .top(height/2)
      .textAngle(-Math.PI / 2)
      .textStyle('#555')
      .font('bold 14px Helvetica');
     

    /* The dot plot. */
    vis.add(pv.Panel)
        .overflow("hidden")
        .data(items)
        .add(pv.Panel) // group dot and label for redraw
          .def('active', false)
        // .events("all") // - eats all the events that should reach dots.
        .event("mousedown", pv.Behavior.pan())
        .event("mousewheel", pv.Behavior.zoom())
        .event("pan", transform)
        .event("zoom", transform)

        .add(pv.Dot)
          .left(function(d) { return x(d.values(xProp.key).at(that.itemValueIndex)); })
          .bottom(function(d) { return y(d.values(yProp.key).at(that.itemValueIndex)); })
          .radius(function(d) { return zProp ? z(d.values(zProp.key).at(that.itemValueIndex)): 10; })          
          .fillStyle(function(d) { return this.parent.active() ? '#fff' : colors(d.key); })
          .strokeStyle(function(d) { return this.parent.active() ? colors(d.key) : null })
          .lineWidth(4)
            .event("mouseover", function() { return this.parent.active(true); })
            .event("mouseout", function() { return this.parent.active(false); })
        .anchor("top").add(pv.Label)
          .text(function(d) { 
            var str = d.identify();
            
            if (zProp) {
              str += " / "+zProp.name+": "+formatter.format(d.values(zProp.key).at(that.itemValueIndex));
            }
            
            return str;
          })
          .font('12px Helvetica')
          .textStyle('#666')
          .visible(function() { return this.parent.active(); });

    /** Update the x- and y-scale domains per the new transform. */
    function transform() {
      var t = this.transform().invert(),
          t2 = t.translate(0,0), // a copy of the transform object
          tMin, 
          tMax;

      t2.y = -t2.y; // invert the y-offset, because center is on left bottom edge
      tMin = t2.translate(x(xMin), y(yMin));
      tMax = t2.translate(x(xMax), y(yMax));
      x.domain(x.invert(tMin.x), x.invert(tMax.x));
      y.domain(y.invert(tMin.y), y.invert(tMax.y));
      vis.render();
    }

    vis.render();
  }
});

// Displays 1 numbers_series measure for each item
// TODO: make third measure optional
uv.Scatterplot.spec = {
  measures: [
    {
      types: ['number'],
      cardinality: 2
    },
    {
      types: ['number'],
      cardinality: 1,
      optional: true
    }
  ]
};

