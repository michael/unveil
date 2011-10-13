uv.traverser = {};

uv.traverser.BreadthFirst = function(root) {
  var queue = [],
      nodes = [],
      node;
  
  queue.push(root); // enqueue
  while (queue.length > 0) {
    node = queue.shift(); // dequeue
    if (node.p('visible')) {
      nodes.push(node);
      // Enqueue children
      node.all('children').each(function(node, key, index) {
        queue.push(node);
      });
    }
  }
  return nodes;
};

uv.traverser.DepthFirst = function(root) {
  var stack = [],
      nodes = [],
      node;
  
  stack.push(root);
  while (stack.length > 0) {
    node = stack.pop();
    if (node.p('visible')) {
      nodes.push(node);
      // Push children
      node.all('children').each(function(node, key, index) {
        stack.push(node);
      });
    }
  }
  return nodes;
};
