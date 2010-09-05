//-----------------------------------------------------------------------------
// Collection
//-----------------------------------------------------------------------------

uv.Collection = function (options) {
  uv.Node.call(this);
  var that = this;
  
  if (options) {
    $.each(options.properties, function(key, options) {
      var p = new uv.Property(that, key, options);
      that.set('properties', key, p);
    });
    
    // initialize items property, even if there are no items in the collection
    this.replace('items', new uv.SortedHash());
    
    $.each(options.items, function(key, i) {
      var item = new uv.Item(that, key, i, true);
    });
  }
};

// The is where transformers have to register
uv.Collection.transformers = {};

uv.Collection.prototype = uv.extend(uv.Node);

uv.Collection.prototype.filter = function(criteria) {
  var c2 = new uv.Collection();
  c2.replace('items', criteria.items(this));
  
  // TODO: Find a better way
  // Sadly, everything needs to be copied in order 
  // to reflect correct connections between nodes
  this.all('properties').eachKey(function(key, p) {
    // get the right values
    var pcopy = p.clone(c2);
    // register values
    p.all('values').eachKey(function(key, v) {
      var sharedItems = c2.all('items').intersect(v.all('items'));
      if (sharedItems.length > 0) {
        var vcopy = v.clone();
        vcopy.replace('items', sharedItems);
        pcopy.set('values', key, vcopy);
      }
    });
    c2.set('properties', key, pcopy);
  });
  return c2;
};

// Performs an operation and returns a new transformed collection
// The original collection remains untouched
uv.Collection.prototype.transform = function(transformer, params) {
  return uv.Collection.transformers[transformer].call(this, this, params);
};
