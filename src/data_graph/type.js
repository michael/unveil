uv.VALUE_TYPES = [
  'string',
  'number',
  'date',
  'datetime',
  'location'
];

uv.isValueType = function (type) {
  return _.include(uv.VALUE_TYPES, type);
};

uv.Type = function(g, key, type) {
  var that = this;
  uv.Node.call(this);
  
  this.g = g; // belongs to the DataGraph
  this.key = key;
  this.name = type.name;
  
  // extract properties
  _.each(type.properties, function(property, key) {
    var p = new uv.Node();
    p.key = key;
    p.unique = property.unique;
    p.name = property.name;
    p.expected_type = property.expected_type;
    p.replace('values', new uv.SortedHash());
    p.isValueType = function() {
      return uv.isValueType(p.expected_type);
    };
    p.isObjectType = function() {
      return !p.isValueType();
    };
    
    that.set('properties', key, p);
  });
};

uv.Type.prototype = Object.extend(uv.Node);