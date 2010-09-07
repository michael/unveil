var scene;

module("Scene", {
  setup: function() {
    scene = new uv.Scene({
      displays: [
        {
          container: 'canvas',
          width: 200,
          height: 150,
          zooming: true,
          panning: true
        }
      ],
      fillStyle: '#ccc',
      actors: [
        {
          type: 'rect',
          id: 'my_rect',
          x: 20,
          y: 50,
          width: 20,
          height: 20,
          interactive: true
        },
        {
          type: 'circle',
          id: 'my_circle',
          x: 100,
          y: 30,
          radius: 5,
          actors: [
            {
              id: 'my_label',
              type: 'label',
              text: 'LBL1'
            },
            {
              id: 'my_second_label',
              type: 'label',
              text: 'Search me'
            },
            {
              id: 'my_third_label',
              type: 'label',
              text: 'Search me'
            }
          ]
        }
      ]
    });
  },
  teardown: function() {
    // delete scene;
  }
});


test("Actor#remove", function() {
  ok(scene.all('children').length === 2);
  ok(scene.actors['my_rect']);
  ok(scene.interactiveActors['my_rect']);
  
  scene.remove('my_rect');
  ok(scene.all('children').length === 1);
  ok(Object.keys(scene.actors).length === 4);
  ok(!scene.actors['my_rect']);
  ok(!scene.interactiveActors['my_rect']);
  
  scene.remove('my_label');
  ok(scene.get('my_circle').all('children').length === 2);
  ok(Object.keys(scene.actors).length === 3);
  
  // Using a matcher function (for batch removals)
  scene.remove(function(a) {
    return a.p('text') === 'Search me'
  });
  ok(Object.keys(scene.actors).length === 1);
  ok(!scene.get('my_third_label'));
  ok(!scene.get('my_second_label'));
});