Unveil.js
================================================================================

Unveil is a data exploration and visualization toolkit that utilizes data-driven
software design.

[Documentation](http://docs.quasipartikel.at/#/unveil) is under construction but already available.


Features:
--------------------------------------------------------------------------------

* Data Abstractions
  * Collection (for simple collections of similar data items)
  * DataGraph (for linked data)
* Scene API
  * SceneGraph implementation
  * Declarative syntax
  * Custom Actors (graphical objects)
  * Dynamic Actor Properties (you can assign functions instead of values)
  * Motion Tweening
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


New declarative Syntax
--------------------------------------------------------------------------------

I took some inspiration from Scene.js's [Scene Definition Format](http://www.google.com/url?sa=D&q=http://scenejs.wikispaces.com/JSON%2BScene%2BDefinition&usg=AFQjCNEk85cBgWeuJ9ZZO3XaXpOc2FgDVA)
to give the whole thing an even more declarative feel.

Actors as well as the whole Scene can now be specified declaratively using a simple Specification Syntax.

    var scene = new Scene({
      framerate: 30,
      traverser: uv.traverser.BreadthFirst
      displays: [{
        container: $('#canvas'),
        width: 500,
        height: 320,
        zooming: true,
        paning: true
      }],
      actors: [
        {
          id: 'moving_rect',
          type: "rect",
          x: 50,
          y: 70,
          width: 200,
          height: 150,
          actors: [
            {
              type: "label",
              text: "I'm moving"
            }
          ]
        },
        {
          id: 'animated_circle',
          type: "circle",
          x: 50,
          y: 70,
          radius: 50,
          height: 150
        }
      ]
    });

Since all actors have a unique id you can reference them programmatically and add special behavior (e.g. animation).

    scene.get('moving_rect').bind('mouseover', function() {
      this.animate('x', 100, 2000, 'bounceEaseInOut');
      this.animate('y', 200, 2000);
    });
    
    scene.get('moving_rect').bind('click', function() {
      this.animate('rotation', Math.PI/2, 2000);
    });
    
    scene.get('animated_circle').bind('click', function() {
      this.animate('radius', 70, 2000);
    });


Supported Browsers
--------------------------------------------------------------------------------

* Google Chrome 5+
* Safari 4+
* Firefox 3.5+
* Internet Explorer 9+
* Opera 10+