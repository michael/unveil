// Comparators
//-----------------------------------------------------------------------------

uv.Comparators = {};

uv.Comparators.ASC = function(item1, item2) {
  return item1.value === item2.value ? 0 : (item1.value < item2.value ? -1 : 1);
};

uv.Comparators.DESC = function(item1, item2) {
  return item1.value === item2.value ? 0 : (item1.value > item2.value ? -1 : 1);
};

