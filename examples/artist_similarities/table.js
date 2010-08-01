// Table
// =============================================================================

uv.Table = uv.Visualization.extend({
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    this.build();
  },
  build: function() {
    
  },
  render: function() {
    this.$canvas.html(this.renderCollection(this.collection));
  },
  renderItem: function(c, i) {
    var that = this;
    str = '<tr>';
    
    c.all("properties").eachKey(function(key, attr) {
      if (i.type(key) === 'collection') {
        str += '<td>'+that.renderCollection(i.first(key))+'</td>';
      } else {
        str += '<td>'        
        i.values(key).each(function(index, v) {
          str += v+'<br/>';
        });
        str += '</td>'
      }
    });
    
    str += '</tr>';
    return str;
  },
  renderCollection: function(c) {
    var that = this;
    
    str = '<table><thead><tr>';
    c.all("properties").each(function(index, p) {
      str += '<th>'+p.name+'</th>';
    });
    
    str += '</tr></thead><tbody>';

    c.all("items").each(function(index, item) {
      str += that.renderItem(c, item);
    });
    
    str += '</tbody></table>';
    return str;
  }
});

// Specification
//-----------------------------------------------------------------------------

// Displays 1..n numbers
uv.Table.spec = {
  measures: [
    {
      types: ['number', 'string', 'date'],
      unique: true,
      cardinality: 1,
      optional: true
    }
  ]
};