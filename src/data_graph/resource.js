uv.Resource = function(g, key, data) {
  uv.Node.call(this);
  
  this.g = g;
  this.key = key;
  this.type = g.get('types', data.type);
  
  // Memoize raw data for the build process
  this.data = data;
};

uv.Resource.prototype = uv.inherit(uv.Node);

uv.Resource.prototype.build = function() {
  var that = this;
  
  uv.each(this.data.properties, function(property, key) {
    
    // Ask the schema wheter this property holds a
    // value type or an object type
    var values = Array.isArray(property) ? property : [property];
    var p = that.type.get('properties', key);
    
    if (!p) {
      throw "property "+key+" not found at "+that.type.key+" for resource "+that.key+"";
    }
    
    // init key
    that.replace(p.key, new uv.SortedHash());
    
    if (p.isObjectType()) {
      uv.each(values, function(v, index) {
        var res = that.g.get('resources', v);
        if (!res) {
          throw "Can't reference "+v;
        }
        that.set(p.key, res.key, res);
      });
    } else {
      uv.each(values, function(v, index) {
        var val = p.get('values', v);
        
        // Check if the value is already registered
        // on this property
        if (!val) {
          val = new uv.Node({value: v});
        }
        that.set(p.key, v, val);
        p.set('values', v, val);
      });
    }
  });
};

// Delegates to Node#get if 3 arguments are provided
uv.Resource.prototype.get = function(property, key) {
  var p = this.type.get('properties', property);
  if (!p) return null;
  
  if (arguments.length === 1) {
    if (p.isObjectType()) {
      return p.unique ? this.first(property) : this.all(property);
    } else {
      return p.unique ? this.value(property) : this.values(property);
    }
  } else {
    return uv.Node.prototype.get.call(this, property, key);
  }
};
