uv.traverser = {};

uv.traverser.BreadthFirst = function(scene) {
  var queue = [],
      nodes = [],
      node;
  
  queue.push(scene); // enqueue
  while (queue.length > 0) {
    node = queue.shift(); // dequeue
    if (node.p('visible')) {
      nodes.push(node);
      // Enqueue children
      node.all('children').each(function(index, node) {
        queue.push(node);
      });
    }
  }
  return nodes;
};


uv.traverser.DepthFirst = function(scene) {
  var stack = [],
      nodes = [],
      node;
  
  stack.push(scene);
  while (stack.length > 0) {
    node = stack.pop();
    if (node.p('visible')) {
      nodes.push(node);
      // Push children
      node.all('children').each(function(index, node) {
        stack.push(node);
      });
    }
  }
  return nodes;
};
