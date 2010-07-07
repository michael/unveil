//-----------------------------------------------------------------------------
// Visualization API Test Suite
//-----------------------------------------------------------------------------

var c, vis;

module("Visualization", {
  setup: function() {
    c = new uv.Collection(countries_fixture);
    vis = new uv.Barchart(c, {
      measures: ['population', 'area', 'gdp_nominal'],
      params: {}
    });
  },
  teardown: function() {
    delete c;
  }
});

test("Construction", function() {  
  ok(vis instanceof uv.Visualization);
  ok(vis instanceof uv.Barchart);
  ok(vis.collection instanceof uv.Collection);
});

test('Visualization#property', function() {
  ok(vis.property(0).key === 'population');
  ok(vis.property(1).key === 'area');
  ok(vis.property(2).key === 'gdp_nominal');
});

test("Verification", function() {  
  // valid with three number measures
  ok(vis.isValid());
  
  // not valid with zero specified measures
  vis.measures = [];
  ok(!vis.isValid());
  
  // not valid with one non-number measure
  vis.measures = ['official_language'];
  ok(!vis.isValid());
  
  // not valid with any non-number measure
  vis.measures = ['population', 'official_language', 'area'];
  ok(!vis.isValid());
  
  // not valid with any non-number measure
  vis.measures = ['population', 'area'];
  ok(vis.isValid());
});


