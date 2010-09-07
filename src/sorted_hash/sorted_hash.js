// SortedHash
// =============================================================================

// Constructor
// Initializes a Sorted Hash
uv.SortedHash = function (data) {
  var that = this;
  this.data = {};
  this.keyOrder = [];
  this.length = 0;
  
  if (data instanceof Array) {
    uv.each(data, function(datum, index) {
      that.set(index, datum);
    });
  } else if (data instanceof Object) {
    uv.each(data, function(datum, key) {
      that.set(key, datum);
    });
  }
};


// Returns a copy of the sorted hash
// Used by transformation methods
uv.SortedHash.prototype.clone = function () {
  var copy = new uv.SortedHash();
  copy.length = this.length;
  uv.each(this.data, function(value, key) {
    copy.data[key] = value;
  });
  copy.keyOrder = this.keyOrder.slice(0, this.keyOrder.length);
  return copy;
};

// Set a value at a given key
// Parameters:
//   * key [String]
uv.SortedHash.prototype.set = function (key, value) {
  if (key === undefined)
    return this;
  if (!this.data[key]) {
    this.keyOrder.push(key);
    this.length += 1;
  }
  this.data[key] = value;
  return this;
};

// Get value at given key
// Parameters:
//   * key [String]
uv.SortedHash.prototype.get = function (key) {
  return this.data[key];
};

// Remove entry at given key
// Parameters:
//   * key [String]
uv.SortedHash.prototype.del = function (key) {
  if (this.data[key]) {
    this.keyOrder.splice($.inArray(key, this.keyOrder), 1);
    delete this.data[key];
    this.length -= 1;    
  }
  return this;
};

// Get value at given index
// Parameters:
//   * index [Number]
uv.SortedHash.prototype.at = function (index) {
  var key = this.keyOrder[index];
  return this.data[key];
};

// Get first item
uv.SortedHash.prototype.first = function () {
  return this.at(0);
};

// Get last item
uv.SortedHash.prototype.last = function () {
  return this.at(this.length-1);
};

// Returns for an index the corresponding key
// Parameters:
//   * index [Number]
uv.SortedHash.prototype.key = function (index) {
  return this.keyOrder[index];
};

// Iterate over values contained in the SortedHash
// Parameters:
//   * [Function] 
uv.SortedHash.prototype.each = function (f) {
  var that = this;
  uv.each(this.keyOrder, function(key, index) {
    f.call(that, index, that.data[key]);
  })
  return this;
};

// Iterate over values contained in the SortedHash
// Parameters:
//   * [Function] 
uv.SortedHash.prototype.eachKey = function (f) {
  var that = this;
  uv.each(this.keyOrder, function (key, index) {
    f.call(that, key, that.data[key]);
  });
  return this;
};


// Convert to an ordinary JavaScript Array containing
// the values
// 
// Returns:
//   * Array of items
uv.SortedHash.prototype.values = function () {
  var result = [];
  this.eachKey(function(key, value) {
    result.push(value);
  });
  return result;
};

// Convert to an ordinary JavaScript Array containing
// key value pairs — used for sorting
// 
// Returns:
//   * Array of key value pairs
uv.SortedHash.prototype.toArray = function () {
  var result = [];
  
  this.eachKey(function(key, value) {
    result.push({key: key, value: value});
  });
  
  return result;
};


// Map the SortedHash to your needs
// Parameters:
//   * [Function] 
uv.SortedHash.prototype.map = function (f) {
  var result = this.clone(),
      that = this;
  result.each(function(index, item) {
    result.data[that.key(index)] = f.call(result, item);
  });
  return result;
};

// Select items that match some conditions expressed by a matcher function
// Parameters:
//   * [Function] matcher function
uv.SortedHash.prototype.select = function (f) {
  var result = new uv.SortedHash(),
      that = this;
  
  this.eachKey(function(key, value) {
    if (f.call(that, key, value)) {
      result.set(key, value);
    }
  });
  return result;
};

// Performs a sort on the SortedHash
// Parameters:
//   * comparator [Function] A comparator function
// Returns:
//   * The now re-sorted SortedHash (for chaining)
uv.SortedHash.prototype.sort = function (comparator) {
  var result = this.clone();
      sortedKeys = result.toArray().sort(comparator);

  // update keyOrder
  result.keyOrder = $.map(sortedKeys, function(k) {
    return k.key;
  });
  
  return result;
};


// Performs an intersection with the given SortedHash
// Parameters:
//   * sortedHash [SortedHash]
uv.SortedHash.prototype.intersect = function(sortedHash) {
  var that = this,
  result = new uv.SortedHash();
  
  this.eachKey(function(key, value) {
    sortedHash.eachKey(function(key2, value2) {
      if (key === key2) {
        result.set(key, value);
      }
    });
  });
  return result;
};

// Performs an union with the given SortedHash
// Parameters:
//   * sortedHash [SortedHash]
uv.SortedHash.prototype.union = function(sortedHash) {
  var that = this,
  result = new uv.SortedHash();
  
  this.eachKey(function(key, value) {
    if (!result.get(key))
      result.set(key, value);
  });
  sortedHash.eachKey(function(key, value) {
    if (!result.get(key))
      result.set(key, value);
  });
  return result;
};