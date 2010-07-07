var nested_collection_fixture = {
  "items": {
    "metallica": {
      "name": "Metallica",
      "similar_artists": {
        "korn": {
          "name": "Korn",
          "score": 0.8
        },
        "acdc": {
          "name": "AC/DC",
          "score": 0.7
        }
      }
    }
  },
  "properties": {
    "name": {
      "name": "Artist Name",
      "type": "string",
      "unique": true
    },
    "similar_artists": {
      "name": "Similar Artists",
      "type": "collection",
      "unique": true,
      "properties": {
        "name": {
          "name": "Artist Name",
          "type": "string",
          "unique": true 
        },
        "score": {
          "name": "Similarity Score",
          "type": "number",
          "unique": true 
        }
      }
    }
  }
};