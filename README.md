Unveil.js
================================================================================

Unveil is a data exploration and visualization toolkit that utilizes data-driven
software design. It features several modules:

Collection API
--------------------------------------------------------------------------------

Collections are the main building block of the toolkit.
A Collection is a simple data abstraction format that tries to. It's basiscally
specified as an exchange format for tabular-like data (like CSV, but with rich
meta information about the data's structure).

Collections are represented as a JSON string. This serves as an exchange format.
However after passing the raw format to the Collection constructor, they are
internally represented as a network of nodes (a graph so to say), that allows
efficient operations on the Collection by traversing the graph instead of iterating
over all items, values etc. Also operations like filtering, grouping etc. are 
already supported. 

See also:

* [Collection API](http://github.com/michael/unveil/src/collection/)
* [Node API](http://github.com/michael/unveil/src/node/)
* [SortedHash API](http://github.com/michael/unveil/src/node/)

Visualization API
--------------------------------------------------------------------------------

The visualization API provides a simple abstraction layer for visualizations to ease
the process of creating re-usable data-driven visualizations. 

The appearance of the result is determined by the underlying data rather than by user
defined plotting options. Visualizations directly access data trough a well defined
interface, the Collection API, so there's no longer a gap between domain data and
data used by the visualization engine.

Such visualization can be re-used in terms of putting in arbitrary data in, 
as long as the data is a valid Collection and satisfies the visualization specification 
(some visualizations exclusively use numbers as their input, others use dates
(e.g. Timeline plots), and so on...).

To perform a visualization you have two things to do:

### 1. Provide data, in form of a Collection

    var salesmen_fixture = {
      properties: {
        "name": {
          type: "string",
          name: "Name",
          unique: true
        },
        "turnover": {
          name: "Turnover",
          type: "number_series",
          unique: false,
          categories: ["2005", "2006", "2007", "2008", "2009", "2010"]
        }
      },
      items: {
        "mayer": {
          name: "Mayer",
          turnover: [
            0.2,
            200.2,
            100.2,
            300.2,
            341.3,
            521.2
          ]
        },
        ...
      }
    };

### 2. Pass the collection to the constructor of the desired visualization

    // load some data (represented as a Collection)
    c = new uv.Collection(salesmen_fixture);

    // construct a visualization based on that data
    vis = new uv.Linechart(c, {
      measures: ['hardware_turnover'],
      params: {}
    });
    vis.render();


See also:

* [Visualization API](http://github.com/michael/unveil/src/visualization/)

