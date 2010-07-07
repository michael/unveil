//-----------------------------------------------------------------------------
// Node API
//-----------------------------------------------------------------------------

var austrian, english, german, eu, austria, germany, uk;

module("Node", {
  setup: function() {
    austrian = new uv.Node({value: 'Austrian'});
    english = new uv.Node({value: 'English'});
    german = new uv.Node({value: 'German'});
    
    // confederations
    eu = new uv.Node();
    
    // countries
    austria = new uv.Node();
    germany = new uv.Node();
    uk = new uv.Node();
    
    // people
    barroso = new uv.Node({value: 'Barroso'});
    
    // connect some nodes
    austria.set('languages', 'at', austrian);
    austria.set('languages', 'ger', german);
    
    eu.set('president', 'barroso', barroso);
  },
  teardown: function() {
    
  }
});

test("get connected nodes", function() {
  // order should be preserved
  ok(austria.all('languages') instanceof uv.SortedHash); // => returns a SortedHash
  ok(austria.all('languages').at(0) === austrian);
  ok(austria.all('languages').at(1) === german);
  
  ok(austria.get('languages', 'at') === austrian);
  ok(austria.get('languages', 'ger') === german);
});

test("get first connected node", function() {  
  ok(eu.first('president') instanceof uv.Node);
  ok(eu.first('president').val === 'Barroso');
});

test("iteration of connected nodes", function() {
  var nodes = [];
  austria.all('languages').each(function(index, node) {
    nodes.push(node);
  });
  ok(nodes.length === 2);
});

test("Node#list", function() {
  // non-unqiue property
  ok(austria.all('languages').length === 2);
  ok(austria.all('languages').get('at') === austrian);
  ok(austria.all('languages').get('ger') === german);
  
  // unique property
  ok(eu.all('president').length === 1);
  ok(eu.values('president').first() === 'Barroso');
});

test("Node#values", function() {
  var values = austria.values('languages');
  
  // for non-unique properties
  ok(values.at(0) === 'Austrian');
  ok(values.at(1) === 'German');
  ok(values.get('at') === 'Austrian');
  ok(values.get('ger') === 'German');
  
  // for unique properties
  ok(eu.values('president').at(0) === 'Barroso');
});

test("Node#value", function() {
  var values = austria.values('languages');
  
  // for non-unique properties
  ok(austria.value('languages') === 'Austrian');
  
  // for unique properties
  ok(eu.value('president') === 'Barroso');
});

