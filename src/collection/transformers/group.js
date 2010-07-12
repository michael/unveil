uv.Collection.transformers.group = function(c, params) {
  var c2 = new uv.Collection(),
      property = c.get('properties', params.property),
      values = property.all('values');
  
  // compute properties
  c.all('properties').eachKey(function(key, p) {
    if (p.key === property.key || p.type === 'number') {
      var p2 = new uv.Property(c2, key, {type: p.type, name: p.name, unique: p.unique});
      c2.set('properties', key, p2);
    }
  });
  
  function aggregate(items, property, aggregator) {
    var values = new uv.SortedHash();
    items.eachKey(function(key, item) {
      var val = item.value(property);
      values.set(val, val);
    });
    return Aggregators[aggregator](values);
  };
  
  values.each(function(index, value) {
    var aggregatedItem = {};
    var items = value.all('items');
    
    // aggregation
    c2.all('properties').eachKey(function(key, p) {
      if (key === params.property) {
        aggregatedItem[key] = value.val;
      } else {
        aggregatedItem[key] = aggregate(items, key, params.aggregator);
      }
    });
    
    var i = new uv.Item(c2, value.val, aggregatedItem);
  });
    
  return c2;
};

// Transformer specification
uv.Collection.transformers.group.label = "Group By";
uv.Collection.transformers.group.params = {
  property: {
    name: "Property",
    type: "property"
  },
  aggregator: {
    name: "Aggregator Function",
    type: "aggregator"
  }
};

