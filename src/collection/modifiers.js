//-----------------------------------------------------------------------------
// Modifiers
//-----------------------------------------------------------------------------

uv.Modifiers = {};

// The default modifier simply does nothing
uv.Modifiers.DEFAULT = function (attribute) {
  return attribute;
};

uv.Modifiers.MONTH = function (attribute) {
  return attribute.getMonth();
};

uv.Modifiers.QUARTER = function (attribute) {
  return Math.floor(attribute.getMonth() / 3) + 1;
};

