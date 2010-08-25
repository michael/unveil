//-----------------------------------------------------------------------------
// Item
//-----------------------------------------------------------------------------

uv.Item = function (collection, key, attributes, nested) {
  var that = this;
  
  // super call / node constructor
  uv.Node.call(this);
  this.key = key;
    
  // register item properties
  $.each(attributes, function(key, values) {
    var property = collection.get('properties', key);
    var valueKey;
    
    if (!$.isArray(values)) {
      values = [values];
    }
    
    $.each(values, function(index, v) {
      var value;
      if (property.type === 'collection') {
        value = new uv.Collection({properties: property.collection_properties, items: v});
        valueKey = 'collection'; // serves as the collection values key name
      } else {
        value = property.registerValue(v);
        valueKey = v;
        // connect value with its items
        value.set('items', that.key, that);
      }
      // connect item with its values
      that.set(key, index, value);
    });
  });
  
  this.collection = collection;
  collection.set('items', key, this);
};

uv.Item.prototype = Object.extend(uv.Node);

// return the type of a specific property
uv.Item.prototype.type = function (property) {
  var p = this.collection.get("properties", property);
  return p.type;
};

// tries to find a name property, that identifies the item
uv.Item.prototype.identify = function() {
  var identifier = this.value('name') || this.value('source');
  return identifier || this.key;
};


