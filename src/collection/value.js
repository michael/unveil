//-----------------------------------------------------------------------------
// Value
//-----------------------------------------------------------------------------

// A value after construction is not connected to other nodes
// Property#registerValue initializes the connections appropriately
uv.Value = function (value) {
  var that = this;
  // super call / node constructor
  uv.Node.call(this, {value: value});
};

uv.Value.prototype = Object.extend(uv.Node);

// Returns a copy without items
// used by uv.Collection#filter
uv.Value.prototype.clone = function () {
  var copy = new uv.Value(this.val);
  copy.replace('items', new uv.SortedHash());
  return copy;
};
