//-----------------------------------------------------------------------------
// SortedHash API
// An awesome data structure you've always been missing in JavaScript
//-----------------------------------------------------------------------------

var items;

module("SortedHash", {
  setup: function() {
    items = new uv.SortedHash();
    items.set("at", "Austria");
    items.set("de", "Germany");
  },
  teardown: function() {
    delete items;
  }
});

test("construction from Array", function() {
  var numbers = new uv.SortedHash([1, 2, 5, 10]);
  
  ok(numbers.at(0) === 1);
  ok(numbers.at(1) === 2);
  ok(numbers.at(2) === 5);
  ok(numbers.at(3) === 10);

  // key equals index
  ok(numbers.get(0) === 1);
  ok(numbers.get(1) === 2);
  ok(numbers.get(2) === 5);
  ok(numbers.get(3) === 10);
  
  ok(numbers.length === 4);
});

test("construction from Hash", function() {
  var countries = new uv.SortedHash({
    'at': 'Austria',
    'de': 'Germany',
    'ch': 'Switzerland'
  });
  
  // please note: order is undetermined since native javascript hashes
  // are not sorted. please perform a sort() operation after construction
  // if you want to rely on item ordering.
  ok(countries.get('at') === 'Austria');
  ok(countries.get('de') === 'Germany');
  ok(countries.get("ch") === "Switzerland");
  ok(countries.length === 3);
});

test("insertion", function() {
  items.set("ch", "Switzerland");
  ok(items.length === 3);
});

test("value overwrite", function() {
  items.get("at") === "Austria";
  items.set("at", "Österreich");
  ok(items.length === 2);
  ok(items.get("at") === "Österreich");
});

test("clone", function() {
  // TODO: add some assertions
  items.clone();
});

test("key", function() {
  ok(items.key(0) === "at");
  ok(items.key(1) === "de");
});


test("hash semantics", function() {
  var keys = [];
  var values = [];
  
  ok(items.get("at") === "Austria");
  ok(items.get("de") === "Germany");
  
  // order is also reflected in eachKey
  items.eachKey(function(key, value) {
    keys.push(key);
    values.push(value);
  });
  
  ok(keys.length === 2 && values.length === 2);
  ok(keys[0] === 'at');
  ok(keys[1] === 'de');
  ok(values[0] === 'Austria');
  ok(values[1] === 'Germany');
});

test("array semantics", function() {
  var values = [];
  items.get(0) === "Austria";
  items.get(1) === "Germany";
  items.length === 1;
  
  items.each(function(index, value) {
    values.push(value);
  });
  
  ok(values.length === 2);
  ok(values[0] === 'Austria');
  ok(values[1] === 'Germany');
  
  ok(items.first() === "Austria");
  ok(items.last() === "Germany");
  
});


test("SortedHash#del", function() {
  items.set("ch", "Switzerland");
  items.del('de');
  ok(items.length === 2);
  ok(items.keyOrder.length === 2);
  ok(items.get('de') === undefined);
});


test("SortedHash#each", function() {
  var enumerated = [];
  items.each(function(index, item) {
    enumerated.push(item);
  });
  
  ok(enumerated[0]==="Austria");
  ok(enumerated[1]==="Germany");
});

test("SortedHash#values", function() {
  items.set("ch", "Switzerland");
  var values = items.values();

  ok(values[0] === "Austria");
  ok(values[1] === "Germany");
  ok(values[2] === "Switzerland");
});

test("SortedHash#sort", function() {
  items.set("ch", "Switzerland");

  ok(items.at(0)==="Austria");
  ok(items.at(1)==="Germany");
  ok(items.at(2)==="Switzerland");
  
  // sort descending
  var sortedItems = items.sort(uv.Comparators.DESC);
  
  ok(sortedItems.at(0)==="Switzerland");
  ok(sortedItems.at(1)==="Germany");
  ok(sortedItems.at(2)==="Austria");
});


test("SortedHash#map", function() {
  var mappedItems = items.map(function (item) {
    return item.slice(0, 3);
  });
  
  // leave original SortedHash untouched
  ok(items.get('at') === 'Austria');
  ok(items.get('de') === 'Germany');
  ok(items.at(0) === 'Austria');
  ok(items.at(1) === 'Germany');

  ok(mappedItems.get('at') === 'Aus');
  ok(mappedItems.get('de') === 'Ger');  

  ok(mappedItems.at(0) === 'Aus');
  ok(mappedItems.at(1) === 'Ger');
});

test("SortedHash#select", function() {
  var selectedItems = items.select(function (key, i) {
        return i === 'Austria';
      });

  // leave original SortedHash untouched
  ok(items.get('at') === 'Austria');
  ok(items.get('de') === 'Germany');
  ok(items.at(0) === 'Austria');
  ok(items.at(1) === 'Germany');
  
  ok(selectedItems.at(0) === 'Austria');
  ok(selectedItems.get("at") === 'Austria');
  ok(selectedItems.length === 1);
});

test("SortedHash#intersect", function() {
  var items2 = new uv.SortedHash(),
      intersected;
  
  items2.set('fr', 'France');
  items2.set('at', 'Austria');
  
  // leave original SortedHashes untouched
  ok(items.get('at') === 'Austria');
  ok(items.get('de') === 'Germany');
  ok(items.at(0) === 'Austria');
  ok(items.at(1) === 'Germany');
  
  ok(items2.get('fr') === 'France');
  ok(items2.get('at') === 'Austria');
  ok(items2.at(0) === 'France');
  ok(items2.at(1) === 'Austria');
  
  intersected = items.intersect(items2);
  ok(intersected.length === 1);
  ok(intersected.get('at') === 'Austria');
});


test("SortedHash#union", function() {
  var items2 = new uv.SortedHash(),
      unitedItems;
  
  items2.set('fr', 'France');
  items2.set('at', 'Austria');
  
  // leave original SortedHashes untouched
  ok(items.get('at') === 'Austria');
  ok(items.get('de') === 'Germany');
  ok(items.at(0) === 'Austria');
  ok(items.at(1) === 'Germany');
  
  ok(items2.get('fr') === 'France');
  ok(items2.get('at') === 'Austria');
  ok(items2.at(0) === 'France');
  ok(items2.at(1) === 'Austria');
  
  unitedItems = items.union(items2);
  ok(unitedItems.length === 3);
  ok(unitedItems.get('at') === 'Austria');
  ok(unitedItems.get('de') === 'Germany');
  ok(unitedItems.get('fr') === 'France');
});

test("fail prevention", function() {
  items.set(null, 'Netherlands');
  items.set(undefined, 'Netherlands');
  items.set('null_value', null);
  items.set('undefined_value', undefined);
  ok(items.length === 4);
});