//-----------------------------------------------------------------------------
// Property
//-----------------------------------------------------------------------------

uv.Property = function (collection, key, options) {
  // super call / node constructor
  uv.Node.call(this);
  
  // construct properties
  this.key = key;
  this.type = options.type;
  this.name = options.name;
  this.descr = options.descr;
  
  this.unique = options.unique;
  this.categories = options.categories;
  this.collection = collection;
  
  // remember properties for nested collection
  if (options.properties) {
    this.collection_properties = options.properties;
  }
};

uv.Property.prototype = uv.extend(uv.Node);

// Returns a copy without values
// used by Collection#filter
uv.Property.prototype.clone = function (collection) {
  var copy = new uv.Property(collection, this.key, {
    type: this.type,
    name: this.name
  });
  copy.replace('values', new uv.SortedHash());
  return copy;
};

uv.Property.prototype.toString = function() {
  return this.name;
};

// aggregates the property's values
uv.Property.prototype.aggregate = function (f) {
  return f(this.values("values"));
};

// Private Methods
//-----------------------------------------------------------------------------

uv.Property.prototype.registerValue = function(rawValue) {
  var value = this.get('values', rawValue);
  if (value === undefined) {
    value = new uv.Value(rawValue);
    this.set('values', rawValue, value);
  }
  return value;
};


