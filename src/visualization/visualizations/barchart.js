//-----------------------------------------------------------------------------
// Barchart
//-----------------------------------------------------------------------------

uv.Barchart = uv.Visualization.extend({
  // extend: { isConcreteVisualization: true },
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
  },
  render: function() {
    var that = this;
    setTimeout(function() {
      // for some reason otherwise there's strange rendering behavior
      // at least in google chrome
      that.renderChart();
    }, 1);
  },
  renderChart: function() {
    var that = this;
    
    if (!this.isValid()) {
      this.$canvas.html('Cannot render. Change your settings.');
      return;
    }
    
    var minima = [];
    var maxima = [];
    $.each(this.measures, function(i, measure) {
      var p = that.property(i);
      minima.push(p.aggregate(uv.Aggregators.MIN));
      maxima.push(p.aggregate(uv.Aggregators.MAX));
    });
    
    /* Sizing and scales. */
    var items = this.collection.all("items").values(),
        yMin = Math.min.apply(this, minima),
        yMax = Math.max.apply(this, maxima),
        w = 400, // this.$canvas.width()-100,
        h = this.$canvas.height()-70,
        // x = pv.Scale.ordinal(pv.range(n)).splitBanded(0, w, 4/5),
        y = pv.Scale.linear(yMin, yMax).nice().range(0, h),
        // c = pv.Scale.linear(yMin, (yMin+yMax)/2, yMax).range("red", "yellow", "green")
        barWidth = 20,
        barOffset = 2,
        groupWidth = this.measures.length*(barWidth+barOffset),
        groupOffset = 20,
        formatter = pv.Format.number();
    
    // console.log(items[0].toString());
    
    // y = pv.Scale.linear(yMin, yMax).nice().range(0, height-20),
    
    console.log(items);
    
    colors = ['#C9EF5E', 'blue', 'green'];
    
    /* The root panel. */
    var vis = new pv.Panel()
        // .width(w)
        .height(300)// .height(h)
        .bottom(60)
        .left(100)
        .right(10)
        .canvas('canvas')
        .top(5);

    /* Y-axis ticks. */
    vis.add(pv.Rule)
        .data(y.ticks(10))
        .bottom(y)
        .lineWidth(1)
        // .strokeStyle(function(d) { return d ? "rgba(255,255,255,.3)" : "#000" })
        .strokeStyle('#eee')
      .anchor("left").add(pv.Label)
        .text(y.tickFormat);
    

    /* The bars. */
    var bar = vis.add(pv.Panel)
        .data(items)
        // .fillStyle('#ccc')
        .left(function() { return this.index * (groupWidth+groupOffset) })
        //.fillStyle(function() { return colors[this.index]; })
        .width(groupWidth)
        .def("active", false)
      .add(pv.Panel)
        .data(function(d) {
          var attributes = [];
          $.each(that.measures, function(index, measure) {
            attributes.push({
              label: that.collection.get('properties', measure).name,
              value: d.value(measure)
            });
          });
          
          return attributes;
        })
        // .fillStyle('#eee')
        .left(function() { return this.index * (barWidth+barOffset); })
      .add(pv.Panel)
        .def('active', false) // group bar and label together
      .add(pv.Bar)
        .event("mouseover", function () {
          this.parent.active(true);
          this.parent.render();
        })
        .event("mouseout", function () {
          this.parent.active(false);
          this.parent.render();
        })
        .width(barWidth)
        .bottom(0)
        .height(function(d) { 
          return y(d.value);
        })
        .fillStyle(function (d) {
          // return c(d.value)
          // console.log(this.parent.index);
          return this.parent.active() ? "#C9EF5E" : colors[1];
        })
        .anchor('top').add(pv.Label)
          .text(function(d) {
            // console.log(this.parent.active());
            // return "BLAH";
           return this.parent.active() ? d.value : "";
          })
    
    /* The value label. */
    // bar.anchor("top").add(pv.Label)
    //     .textStyle("white")
    //     .text(function(d) { return d.value }); //  return d.value.toFixed(1)
    





    /* The item label. */
    // bar.parent.anchor("bottom").add(pv.Label)
    //     .textAlign("center")
    //     .textMargin(5)
    //     .text(function(d) { return d.label; })
    //     .textAlign("right")
    //     .textAngle(-Math.PI / 2);



    vis.render();
  }
});


// Specification
//-----------------------------------------------------------------------------

// Displays 1..n numbers
uv.Barchart.spec = {
  measures: [
    {
      types: ['number'],
      unique: true,
      cardinality: 1      
    },
    {
      types: ['number'],
      unique: true,
      cardinality: "*"
    }
  ]
};

// Implementation
//-----------------------------------------------------------------------------

// Barchart.prototype.render = function () {
//   console.log('Rendering barchart');
//   // var width = this.chart.plotWidth()-50,         
//   //     height = this.chart.plotHeight()-110,    
//   //     yProp = this.chart.collection.get("properties", this.chart.measures[0].property),
//   //     that = this,
//   //     items = this.chart.collection.all("items").values(),
//   //     yMin = yProp.aggregate(uv.Aggregators.MIN),
//   //     yMax = yProp.aggregate(uv.Aggregators.MAX),
//   //     y = pv.Scale.linear(yMin, yMax).nice().range(0, height-20),
//   //     x = pv.Scale.linear(0, items.length).range(10, width),
//   //     formatter = pv.Format.number(),
//   //     vis;
//   //     
//   // vis = new pv.Panel()
//   //   .left(this.chart.margin.left)
//   //   .right(this.chart.margin.right)
//   //   .top(this.chart.margin.top)
//   //   .bottom(100)
//   //   .width(4000)
//   //   .height(height)
//   //   .canvas('chart');
//   //   
//   // // yAxis ticks
//   // vis.add(pv.Rule)
//   //     .data(y.ticks())
//   //     .strokeStyle("#eee")
//   //     .lineWidth(1)
//   //     .bottom(function (d) {
//   //       return parseInt(y(d), 10) + 0.5;
//   //     })
//   //   .anchor("left").add(pv.Label)
//   //     .text(y.tickFormat)
//   //     .font('11px Helvetica')
//   //     .textStyle('#777');
//   //   
//   // // yAxis Name
//   // vis.add(pv.Label)
//   //   .text(yProp.name)
//   //   .left(-85)
//   //   .top(height/2)
//   //   .textAngle(-Math.PI / 2)
//   //   .textStyle('#555')
//   //   .font('bold 14px Helvetica');
//   //     
//   // // actual data
//   // vis.add(pv.Panel)
//   //     .data(items)
//   //     .left(function () {
//   //       return this.index * 15; 
//   //     })
//   //   .add(pv.Panel) // group bar and label for redraw
//   //     .def("active", false)
//   //   .add(pv.Bar)
//   //     .bottom(0)
//   //     .width(10)
//   //     .height(function (d) {
//   //       return y(d.value(yProp.key));
//   //     })
//   //     .fillStyle(function () {
//   //       return this.parent.active() ? "#C9EF5E" : "#99B24F";
//   //     }) 
//   //     .event("mouseover", function () {
//   //       return this.parent.active(true);
//   //     })
//   //     .event("mouseout", function () {
//   //       return this.parent.active(false); 
//   //     })
//   //   .anchor("top").add(pv.Label)
//   //     .bottom(-10)
//   //     .left(0)
//   //     .textAlign("right")
//   //     .textAngle(-Math.PI / 2)
//   //     .text(function (d) {
//   //       return d.identify();
//   //     })
//   //     .textStyle(function(d) {
//   //       return this.parent.active() ? '#000' : '#777'
//   //     })
//   //     .font('11px Helvetica')
//   //   .anchor("top")
//   //     .add(pv.Label)
//   //       .text(function (d) {
//   //         return formatter.format(d.value(yProp.key));
//   //       })
//   //       .bottom(function (d) { return y(d.value(yProp.key))+20; })
//   //       .font('bold 11px Helvetica')
//   //       .visible(function () { return this.parent.active(); });
//   // vis.render();
// };

