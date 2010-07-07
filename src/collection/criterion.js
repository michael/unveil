//-----------------------------------------------------------------------------
// Criterion
//-----------------------------------------------------------------------------

uv.Criterion = function (operator, property, value) {
  this.operator = operator;
  this.property = property;
  this.value = value;
  this.children = [];
};

uv.Criterion.operators = {};

// Logical Connectors
//-----------------------------------------------------------------------------

uv.Criterion.operators.AND = function(collection, criteria) {
  if (criteria.length === 0) return new uv.SortedHash();
  var result = criteria[0].items(collection);
  for(var i=1; i < criteria.length; i++) {
    result = result.intersect(criteria[i].items(collection));
  }
  return result;
};

uv.Criterion.operators.OR = function(collection, criteria) {
  var result = new uv.SortedHash();
  for(var i=0; i < criteria.length; i++) {
    result = result.union(criteria[i].items(collection));
  }
  return result;
};

// Logical Operators
//-----------------------------------------------------------------------------

// used for faceted browsing
uv.Criterion.operators.CONTAINS = function(collection, property_key, value) {
  var property = collection.get('properties', property_key),
      v = property.get('values', value);
  return v.all('items');
};

uv.Criterion.operators.GT = function(collection, property_key, value) {
  var property = collection.get('properties', property_key),
      values = property.all('values'),
      matchedItems = new uv.SortedHash();
  values = values.select(function(key, v) {
    return v.val >= value;
  });
  values.each(function(i, v) {
    matchedItems = matchedItems.union(v.all('items'));
  });
  return matchedItems;
};

uv.Criterion.prototype.add = function(criterion) {
  this.children.push(criterion);
  return this;
};

uv.Criterion.prototype.items = function(collection) {
  // execute operator
  if (this.operator === "AND") {
    return uv.Criterion.operators.AND(collection, this.children);
  } else if (this.operator === "OR") {
    return uv.Criterion.operators.OR(collection, this.children);
  } else {
    // leaf nodes
    return uv.Criterion.operators[this.operator](collection, this.property, this.value);
  }
};

