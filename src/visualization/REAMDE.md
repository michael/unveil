Visualization API (Draft)
================================================================================

The visualization API provides an abstraction layer for visualizations to ease
the process of creating re-usable data-driven visualizations. 
To accomplish this, a data-driven methodology used. 


Visualization Specification
--------------------------------------------------------------------------------

There are various types of visualizations. Some exclusively use numbers as their input, some use dates (e.g. Timeline plots)
others visualize relationships between data items (e.g. which countries share the same currecnty). 
There are further visualizations that use various combinations of measure types.


    // Displays 1..n number properties
    uv.Barchart.spec = {
      measures: [
        {
          types: ['number'],
          unique: true,
          cardinality: 1      
        },
        {
          types: ['number'],
          unique: true,
          cardinality: "*"
        }
      ]
    };