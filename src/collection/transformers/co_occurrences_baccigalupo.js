uv.Collection.transformers.coOccurrencesBaccigalupo = function(c, params) {
  // GET RID OF THIS CODE - SOON!
  var artist_genres = {};
  
  if (c.get('properties', 'genres') && c.get('properties', 'artists')) {
    
    c.all("items").each(function(i, item) {
      $.each(item.values('artists'), function(index, artist) {
        artist_genres[artist] = item.values('genres')[index];
      });
    });
  }
  // GET RID OF THIS CODE - SOON! END
  
  
  // check for valid params
  if (!params.property || !params.knn) return c;
  
  var targetItems = {},
      property = c.get('properties', params.property),
      values = property.all('values');
  
  function checkDistance(playlist, v1, v2, d) {
    for (var i = 0; i<playlist.values(params.property).length-d; i++) {
      if (playlist.values(params.property)[i]===v1.val && playlist.values(params.property)[i+d+1]===v2.val)
        return true;
    }
    return false;
  };
  
  function coOccurencesAtDistance(v1, v2, d) {
    var items1 = v1.all('items'),
        items2 = v2.all('items'),
        playlists = items1.intersect(items2);
        
    return playlists.select(function(key, p) {
      return checkDistance(p, v1, v2, d);
    }).length;
  };
  
  function similarity(v1, v2) {
    return 1*coOccurencesAtDistance(v1, v2, 0) +
           0.8* coOccurencesAtDistance(v1, v2, 1) +
           0.64* coOccurencesAtDistance(v1, v2, 2);
  };
  
  // get property values
  values.each(function(index, value) {
    targetItems[value.val] = {
      source: value.val,
      "similar_items": {}
    };

    var similarItems = [];
    
    values.each(function (index, otherValue) {
      var sim = similarity(value, otherValue);
      if (sim>0) {
        similarItems.push({
          "name": otherValue.val,
          "number_of_cooccurrences": 0,
          "score": sim,
          "checker": artist_genres[otherValue.val]
        });
      }
    });
        
    // sort by score
    similarItems.sort(function(item1, item2) {
      var value1 = item1.score,
          value2 = item2.score;
      return value1 === value2 ? 0 : (value1 > value2 ? -1 : 1);
    });
    
    similarItems = similarItems.slice(0, params.knn);
    
    var similarItemsHash = {};
    $.each(similarItems, function(index, item) {
      similarItemsHash[item.name] = item;
    });
    
    targetItems[value.val].source = value.val;
    targetItems[value.val].checker = artist_genres[value.val];
    targetItems[value.val].similar_items = similarItemsHash;
  });
  
  // construct a new collection that models coocurrences
  var cspec = {
    properties: {
      source: {
        name: "Source",
        type: "string",
        unique: true
      },
      checker: {
        name: "Checker (Optional)",
        type: "string",
        unique: true
      },
      similar_items: {
        name: "Similar Items",
        type: "collection",
        unique: true,
        properties: {
          "name": {
            name: 'Name',
            type: 'string',
            unique: true
          },
          "number_of_cooccurrences": {
            name: 'Number of Co-occurrences',
            type: 'number',
            unique: true
          },
          "score": {
            name: 'Similarity Score',
            type: 'number',
            unique: true
          },
          "checker": {
            name: 'Checker (Optional)',
            type: 'string',
            unique: true
          }
        }
      }
    },
    items: targetItems
  };
  return new uv.Collection(cspec);
};

// Transformer specification
uv.Collection.transformers.coOccurrencesBaccigalupo.label = "Co-Occurrences Baccigalupo";
uv.Collection.transformers.coOccurrencesBaccigalupo.params = {
  property: {
    name: "Property",
    type: "property"
  },
  knn: {
    name: "K-nearest Neighbor",
    type: "number"
  }
};