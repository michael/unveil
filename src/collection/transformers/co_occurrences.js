uv.Collection.transformers.coOccurrences = function(c, params) {
  if (!params.property || !params.knn) return c;
  
  var targetItems = {},
      property = c.get('properties', params.property),
      values = property.all('values');
  
  function coOccurrences(v1, v2) {
    var items1 = v1.all('items'),
        items2 = v2.all('items');
    return items1.intersect(items2).length;
  };
  
  function similarity(v1, v2) {
    return 0.5* (coOccurrences(v1, v2) / coOccurrences(v1, v1)
          + coOccurrences(v2, v1) / coOccurrences(v2, v2));
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
      if (sim>0 && value.val !== otherValue.val) {
        similarItems.push({
          "name": otherValue.val,
          "number_of_cooccurrences": coOccurrences(value, otherValue),
          "score": sim
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
          }
        }
      }
    },
    items: targetItems
  };
  return new uv.Collection(cspec);
};

// Operation specification
uv.Collection.transformers.coOccurrences.label = "Similarity (COOC)";
uv.Collection.transformers.coOccurrences.params = {
  property: {
    name: "Property",
    type: "property"
  },
  knn: {
    name: "K-nearest Neighbor",
    type: "number"
  }
};