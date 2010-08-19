Unveil.js
================================================================================

Unveil is a data exploration and visualization toolkit that utilizes data-driven
software design.

[Documentation](http://docs.quasipartikel.at/#/unveil) is under construction but already available.

Features:
--------------------------------------------------------------------------------

* Generic data abstraction via Collections
* Visualization API (Pluggable visualizations)
* Scene API
  * SceneGraph implementation
  * Custom Actors (graphical objects)
  * Dynamic Actor Properties (you can assign functions instead of values)
  * Motion Tweening
  * Modification Matrix (applied after the initial transforms, which are specified via properties)
  * Commands (e.g. save cpu cycles using event-based framerate determination)
  * Multiple Displays (the scene can be projected to one or more canvas elements)
  * Adjustable drawing order through Graph Traversers
    Choose from DepthFirst or BreadthFirst or implement your own Traverser
  * Mouse interaction support on Display level (picking, zooming, paning)


Getting started
--------------------------------------------------------------------------------

Probably the easiest way to get started with Unveil.js is to install the
[Dejavis](http://github.com/michael/dejavis) sandbox, and let it generate an example 
visualization, which you can use as a starting point.


Examples
--------------------------------------------------------------------------------

* [Scatterplot](http://dejavis.org/scatterplot) (sandboxed)
* [Stacks](http://dejavis.org/stacks) (sandboxed)
* [Random Bars](http://quasipartikel.at/unveil/examples/random_bars.html)
* [Linechart](http://quasipartikel.at/unveil/examples/linechart.html)
* [Artist Similarities](http://quasipartikel.at/unveil/examples/artist_similarities.html)


Supported Browsers
--------------------------------------------------------------------------------

* Google Chrome 5+
* Safari 4+
* Firefox 3.5+
* Internet Explorer 9+
* Opera 10+