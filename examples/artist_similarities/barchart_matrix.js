function round_float(x,n){
  if(!parseInt(n))
   var n=0;
  if(!parseFloat(x))
   return false;
  return Math.round(x*Math.pow(10,n))/Math.pow(10,n);
}

// Table
// =============================================================================

uv.BarchartMatrix = uv.Visualization.extend({
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    this.property = options.params.property;
    this.nested_property = options.params.nested_property;
  },
  render: function() {
    var w = 200,
        h = 30,
        numberFormat = pv.Format.number(),
        dateFormat = pv.Format.date("%B %Y"),
        property = this.property,
        nested_property = this.nested_property;
    
    if (!this.collection.get('properties', property)) return;
    if (!this.collection.get('properties', property).type === 'collection') return;
    
    /* Color by maximum number of people employed in that job. */
    var c = pv.Scale.log(undefined, function(d) { return pv.max(d.values) })
        .range("#ccc", "#1f77b4");
    
    var chart = document.getElementById('canvas');
    
    // clear the canvas
    $(chart).html('');
        
    // prepare the data
    var data = [];
    
    var items = this.collection.all('items');
    
    // sort by name
    items.sort(function(item1, item2) {
      var value1 = item1.value.value('source'),
          value2 = item2.value.value('source');
      return value1 === value2 ? 0 : (value1 < value2 ? -1 : 1);
    });
    
    items.each(function(index, item) {
      var sub_items = item.first(property).all('items');

      var values = [];
      var value_names = [];
      var correct_matches = [];
      var correct_matches_count = 0;
      sub_items.each(function(index, i) {
        values.push(i.value(nested_property));
        value_names.push(i.identify());

        var correct = item.value('checker') === i.value('checker');
        if (correct) correct_matches_count++;
        correct_matches.push(correct);
      });
      
      var accuracy = correct_matches_count / values.length;
      data.push({name: item.identify(), values: values, value_names: value_names, correct_matches: correct_matches, accuracy: accuracy});
    });
    
    var items = this.collection.get('items');
    /* Tile the visualization for each job. */
    var vis = new pv.Panel()
        .data(data)
        .width(w)
        .height(h + 10)
        .top(6)
        .left(6)
        .right(6)
        .bottom(6)
        .canvas(function() { return chart.appendChild(document.createElement("span")); })
    
    /* A panel instance to store scales (x, y) and the mouseover index (i). */
    var panel = vis.add(pv.Panel)
        .def("i", -1)
        .def("x", function(d) { return pv.Scale.linear(d.values, pv.index).range(0, w); })
        .def("y", function(d) { return pv.Scale.linear(0, pv.max(d.values)).range(0, h); })
        .bottom(10)
        .events("all")
        .event("mousemove", pv.Behavior.point(Infinity).collapse("y"));
  
    // closure for the correct_matches
    var cached_data;
    
    /* The area. */
    panel.add(pv.Bar)
        .data(function(d) { cached_data = d; return d.values; })
        .fillStyle(function(d, p) { return cached_data.correct_matches[this.index] ? "#3c99b7" : "#90250c"; })
        .left(function() { return parseInt(panel.x()(this.index)); })
        .width(8)
        .height(function(d) { return panel.y()(d); })
        .bottom(0)
        .event("point", function() { return panel.i(this.index) })
        .event("unpoint", function() { return panel.i(-1) });
    
    /* The x-axis. */
    panel.add(pv.Rule)
        .bottom(0);
    
    /* The mouseover dot. */
    panel.add(pv.Dot)
        .visible(function() { return panel.i() >= 0; })
        .left(function() { return panel.x()(panel.i()); })
        .bottom(function(d) { return panel.y()(d.values[panel.i()]); })
        .fillStyle("#ff7f0e")
        .strokeStyle(null)
        .size(10);
    
    panel.add(pv.Label)
        .bottom(-1)
        .textBaseline("top")
        .left(function() { return panel.i() < 0 ? 0 : null })
        .right(function() { return panel.i() < 0 ? null : 0 })
        .textAlign(function() { return panel.i() < 0 ? "left" : "right"; })
        .textStyle(function() { return panel.i() < 0 ? "#999" : "#000"; })
        .text(function(d) { return panel.i() < 0 ? ""
            : d.value_names[panel.i()] + ": "+ round_float(d.values[panel.i()], 2); });

    panel.add(pv.Label)
      .bottom(-1)
      .textBaseline("top")
      .textStyle(function() { return panel.i() < 0 ? "#999" : "#000"; })
      .textAlign('left')
      .text(function(d) { return d.name; });
    

    vis.render();

  }
});

// Specification
//-----------------------------------------------------------------------------

uv.BarchartMatrix.spec = {
  measures: [
    {
      types: ['number', 'string', 'date'],
      unique: true,
      cardinality: 1,
      optional: true
    }
  ]
};

