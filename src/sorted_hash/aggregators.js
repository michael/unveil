// Aggregators
//-----------------------------------------------------------------------------

uv.Aggregators = {};

uv.Aggregators.SUM = function (values) {
  var result = 0;
  
  values.each(function(index, value) {
    result += value;
  });

  return result;
};

uv.Aggregators.MIN = function (values) {
  var result = Infinity;
  values.each(function(index, value) {
    if (value < result) {
      result = value;
    }
  });
  return result;
};

uv.Aggregators.MAX = function (values) {
  var result = -Infinity;
  values.each(function(index, value) {
    if (value > result) {
      result = value;
    }
  });
  return result;
};

uv.Aggregators.AVG = function (values) {
  return uv.Aggregators.SUM(values) / values.length;
};

uv.Aggregators.COUNT = function (values) {
  return values.length;
};

