// Abstract Visualization
// ----------------------------------------------------------------------------
// 
// Functionality is shared with all implemented visualizations

uv.Visualization = new Class({
  constructor: function (collection, options) {
      this.collection = collection;
      this.measures = options.measures;
      this.params = options.params;
      this.$canvas = options.canvas || $('#canvas');
      
      // default margin
      this.margin = {top: 20, right: 20, bottom: 20, left: 20};
  },
  // Checks if the constructed instance conforms to the visualization spec
  isValid: function() {
    var that = this,
        idx = 0, // measure index
        valid = true;
    
    // checks for a given measure if it conforms to a given spec
    function isComplient(idx, mspec) {
      var p = that.property(idx);

      // handle optional measures
      if (mspec.optional && !p)
        return true;
      
      return (p && mspec.types.indexOf(p.type) >= 0 && (p.unique === mspec.unique || mspec.unique === undefined));
    }
    
    $.each(this.constructor.spec.measures, function(index, mspec) {
      var count;
      if (mspec.cardinality === "*") {
        count = that.measures.length-idx; // remaining unchecked measures
      } else {
        count = mspec.cardinality;
      }
      for (var i=0; i<count; i++) {
        if (!isComplient(idx, mspec)) {
          valid = false;
        }
        idx += 1;
      }
    });
    
    return idx >= this.measures.length ? valid : false;
  },
  // returns a property object at given index i
  property: function(i) {
    return this.collection.get('properties', this.measures[i]);
  },
  render: function() {
    this.$canvas.html('render() is not implemented.');
  }
});
