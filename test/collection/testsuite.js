//-----------------------------------------------------------------------------
// Collection API
//-----------------------------------------------------------------------------

module("Collection");

var c = new uv.Collection(countries_fixture);

test("has some properties", function() {
  ok(c.get('properties', 'area') instanceof uv.Node);
  ok(c.get('properties', 'currency_used') instanceof uv.Node);
  ok(c.get('properties', 'doesnotexit') === undefined);
});

test("property is connected to values", function() {
  var governmentForms = c.get('properties', 'form_of_government');
});

test("read item property values", function() {
  var item = c.get('items', 'austria');
  ok(item.value('name') === 'Austria');
  ok(item.value('area') === 83872);
  ok(item.values('form_of_government').length === 2);
});

test("get values of a property", function() {
  var population = c.get('properties', 'population');
  ok(population.all('values').length === 6);
});

// useful for non-unique properties
test("get value of a property", function() {
  var population = c.get('properties', 'population');
  ok(population.value('values') === 8356700);
});

//-----------------------------------------------------------------------------
// Aggregation of property values using Aggregators
//-----------------------------------------------------------------------------

test("Aggregators.*", function() {
  var values = new uv.SortedHash();
  values.set('0', 4);
  values.set('1', 5);
  values.set('2', -3);
  values.set('3', 1);
  
  ok(uv.Aggregators.SUM(values) === 7);
  ok(uv.Aggregators.MIN(values) === -3);
  ok(uv.Aggregators.MAX(values) === 5);
  ok(uv.Aggregators.COUNT(values) === 4);
});

test("allow aggregation of property values", function() {
  var population = c.get("properties", "population");
  ok(population.aggregate(uv.Aggregators.MIN) === 8356700);
  ok(population.aggregate(uv.Aggregators.MAX) === 306108000);
});

//-----------------------------------------------------------------------------
// Nested Collection
//-----------------------------------------------------------------------------

nc = new uv.Collection(nested_collection_fixture);

test("should have a unique property value that is a collection", function() {
  var item = nc.get("items", "metallica");
  
  ok(item.value('name') === 'Metallica');
  
  // get associated collection
  var similarArtists = item.first('similar_artists');
  ok(similarArtists instanceof uv.Collection);
  
  // inspect similar artists
  ok(similarArtists.all('items').length === 2);

  // most similar artist is Korn
  ok(similarArtists.all('items').first().value('name') === 'Korn');
  
  // 2nd similar artist is AC/DC
  ok(similarArtists.all('items').last().value('name') === 'AC/DC');

});


//-----------------------------------------------------------------------------
// Co-Occurences Operation
//-----------------------------------------------------------------------------

var pl = new uv.Collection(playlists_fixture);

module("Transformers");

test("co_occurences_baccigalupo", function() {
  var result = pl.transform('coOccurrencesBaccigalupo', {property: 'artists', knn: 2});
  ok(result.get('properties', 'similar_items').name === "Similar Items");
});

test("co_occurences_pachet", function() {
  var result = pl.transform('coOccurrences', {property: 'artists', knn: 2});
  ok(result.get('properties', 'similar_items').name === "Similar Items");
});

//-----------------------------------------------------------------------------
// SortedHash and Node integration tests
//-----------------------------------------------------------------------------

module("SortedHash");

test("SortedHash#sort and SortedHash#map", function() {
  var countries = c.all("items"),
      sortedCountries = countries.sort(function(item1, item2) {
        // sort by population
        var value1 = item1.value.value('population'),
            value2 = item2.value.value('population');
        return value1 === value2 ? 0 : (value1 < value2 ? -1 : 1);
      }),
      countryNames;
  
  // map to just names
  countryNames = sortedCountries.map(function (country) {
    return country.value('name');
  });
    
  ok(countryNames.at(0) === 'Austria');
  ok(countryNames.at(1) === 'Italy');
  ok(countryNames.at(2) === 'United Kingdom');
  ok(countryNames.at(3) === 'France');
  ok(countryNames.at(4) === 'Germany');
  ok(countryNames.at(5) === 'United States of America');
});

test("SortedHash#select", function() {
  var countries = c.all("items"),
      euro_countries = countries.select(function (key, c) {
        return c.value('currency_used') === 'Euro';
      });
  
  // map to just names
  countryNames = euro_countries.map(function (country) {
    return country.value('name');
  });
  
  ok(countryNames.at(0) === 'Austria');
  ok(countryNames.at(1) === 'Germany');
  ok(countryNames.at(2) === 'France');
  ok(countryNames.at(3) === 'Italy');
});


module('Criterion');

//-----------------------------------------------------------------------------
// Criterion API
//-----------------------------------------------------------------------------

test('Criterion.operators.CONTAINS', function() {
  var matchedItems = uv.Criterion.operators.CONTAINS(c, 'name', 'Austria');
  ok(matchedItems.length === 1);
  ok(matchedItems.at(0).value('name') === 'Austria');
});

test('Criterion.operators.GT', function() {
  var matchedItems = uv.Criterion.operators.GT(c, 'population', 70000000);
  ok(matchedItems.length === 2);
  ok(matchedItems.at(0).value('population') > 70000000);
  ok(matchedItems.at(1).value('population') > 70000000);
});


test("nested criteria", function() {
  // the root criterion takes it all
  var criteria = new uv.Criterion('AND'),
      filteredCollection;
      
  criteria.add(new uv.Criterion('GT', 'population', 10000000));
  criteria.add(new uv.Criterion('OR')
    .add(new uv.Criterion('CONTAINS', 'official_language', 'English Language'))
    .add(new uv.Criterion('CONTAINS', 'official_language', 'German Language')));
  
  filteredCollection = c.filter(criteria);
  ok(filteredCollection.all('items').length === 3);
});


