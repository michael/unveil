//-----------------------------------------------------------------------------
// Barchart
//-----------------------------------------------------------------------------

uv.Barchart = uv.Visualization.extend({
  // extend: { isConcreteVisualization: true },
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    this.build();
  },
  build: function() {
    var that = this;
        data = pv.range(10).map(function(d) { return Math.random() + .1; });
        
    this.items = this.collection.all("items");

    // create scenegraph
    this.scene = new uv.Scene();

    this.items.each(function(index, item) {
      that.scene.add(new uv.Bar({
        x: 40+30*index,
        y: 300,
        width: 20,
        height: parseInt(-0.4*item.value('hardware_turnover'), 10),
        fillStyle: '#7888ff',
        interactive: true
      }));
    });
  },
  render: function() {
    var that = this;
    
    this.scene.display({
      container: $('#canvas'),
      width: 800,
      height: 300,
      paning: true,
      zooming: true
    });
    
    that.scene.start();
  },
  updateMeasure: function(measure) {
    var that = this;
    this.scene.all('children').each(function(index, bar) {
      bar.p('height', parseInt(-0.4*that.items.at(index).value(measure), 10));
    });
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