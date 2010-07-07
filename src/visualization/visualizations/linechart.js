// Linechart
// =============================================================================

uv.Linechart = uv.Visualization.extend({
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    
    this.margin = {top: 30, right: 170, bottom: 30, left: 150};
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
        width = this.$canvas.width()-this.margin.left-this.margin.right-20;
        height = this.$canvas.height()-this.margin.top-this.margin.bottom-20;
        yProp = this.collection.get("properties", this.measures[0]),
        items = this.collection.all("items").values(),
        yMax = yProp.aggregate(uv.Aggregators.MAX),
        yMin = 0, //yProp.aggregate(uv.Aggregators.MIN),
        x = pv.Scale.ordinal(yProp.categories).split(0, width),
        y = pv.Scale.linear(yMin, yMax).range(0, height);
        i = -1,
        formatter = pv.Format.number();
        
        var colors = pv.Scale.ordinal(_.map(items, function(i) { return i.key }))
                     .range('#8DB5C8', '#808E89', '#B16649', '#90963C', '#A2C355', '#93BAA1', '#86A2A9')
      
    
    // addAxes
    // -------------------------------------------------------------------------
    
    function addAxes() {
      
      // x-Axis
      vis.add(pv.Rule)
          .data(yProp.categories)
          .strokeStyle("#eee")
          .left(function(d) {return x(d); })
        .add(pv.Label)
          .bottom(-25)
          .textAlign('center')
          .text(function (d) {return d; })
          .textStyle(function() { return this.index === i ? "#000" : "#666"; })
          .font('11px Helvetica');
        
          
      // y-Axis (values)
      vis.add(pv.Rule)
          .data(y.ticks())
          .visible(function() { return !(this.index % 2) })
          .bottom(function(d) { return Math.round(y(d)) - .5 })
          .strokeStyle("#eee")
        .anchor("left").add(pv.Label)
          .left(-10)
          .text(function(d) { return formatter.format(d.toFixed(1)) })
          .textStyle("#666")
          .font('11px Helvetica');
      
      vis.add(pv.Rule)
        .bottom(0)
        .strokeStyle('#777');
      vis.add(pv.Rule)
        .left(0)
        .strokeStyle('#777');
          
      // yAxis Name
      vis.anchor('left').add(pv.Label)
        .text(yProp.name)
        .left(-70)
        // .top(height/2)
        .textAngle(-Math.PI / 2)
        .textStyle('#777')
        .textAlign('center')
        .font('bold 13px Helvetica')
        .add(pv.Label)
          .left(-50)
          .text(yProp.descr)
          .textStyle('#aaa')
          .font('10px Helvetica')
    }
    
    // addLine
    // -------------------------------------------------------------------------

    function addLines(items) {
      
      // One panel per line
      var panel = vis.add(pv.Panel)
        .data(items)
      /* The line. */
      var line = panel.add(pv.Line)
        .data(function(d) { return d.values(that.measures[0]).values(); } )
        .left(function(d) { return x(yProp.categories[this.index]); })
        .bottom(function(d) { return y(d); })
        .strokeStyle(function(d) { return colors(this.parent.data().key); })
        // .strokeStyle(colors)
        .lineWidth(3);
      
      // The dots
      var dot = line.add(pv.Dot)
          .fillStyle(function() { return this.index === i ? '#fff' : line.strokeStyle() })
          .strokeStyle(function() { return this.index === i ? line.strokeStyle() : null } )
          .size(function(d) { return this.index === i ? 30 : 20})
          .lineWidth(3);
    }
    
    // addLegend
    // -------------------------------------------------------------------------
    
    function addLegend(items) {
      var legend = vis.add(pv.Panel)
        .right(-that.margin.right)
        .width(150)
        // .fillStyle('#ccc')
        .top(0)
      .add(pv.Dot) 
         .data(items) 
         .top(function() { return this.index * 30 })
         .size(70)
         .strokeStyle(null)
         // .fillStyle('red')
         // .fillStyle(function() { console.log(this.index); })
         .fillStyle(function(d) { return colors(d.key); })
      .anchor("right").add(pv.Label)
        .left(10)
        .text(function(d) { return d.identify(); })
        .textStyle("#666")
        .font('11px Helvetica')
      .add(pv.Label)
        .left(80)
        .text(function(d) {
          return d.values(that.measures[0]).values()[i];
        });
    }
    
    // registerEvents
    // -------------------------------------------------------------------------
    
    function registerEvents() {
      vis.add(pv.Bar)
        .fillStyle("rgba(0,0,0,.001)")
        .event("mouseout", function() {
            i = -1;
            // return vis;
            vis.render();
        })
        .event("mousemove", function() {
            i = pv.search(x.range(), vis.mouse().x);
            i = i < 0 ? (-i - 2) : i;
            // return vis;
            vis.render();
        });
    }
    
    
    // Root panel
    // -------------------------------------------------------------------------
    
    var vis = new pv.Panel()
      .width(width).height(height)
      .bottom(this.margin.bottom).top(this.margin.top)
      .left(this.margin.left).right(this.margin.right)
      .canvas(this.$canvas[0]);
    
    // Add x- and y-Axis
    addAxes();
    
    // One trend-line per item
    addLines(items);
    
    // One trend-line per item
    addLegend(items);
    
    // Data point interaction
    registerEvents();

    // Render it
    vis.render();
  }
});


// Specification
//------------------------------------------------------------------------------

// Displays 1 numbers_series measure for each item
uv.Linechart.spec = {
  measures: [
    {
      types: ['number_series'],
      unique: false,
      cardinality: 1,
    }
  ]
};
