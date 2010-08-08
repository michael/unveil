uv.DataGraph = function(g) {
  uv.Node.call(this);
  var that = this;
  
  // schema nodes
  var types = _.select(g, function(node, key) {
    if (node.type === 'type') {
      that.set('types', key, new uv.Type(this, key, node));
      return true;
    }
    return false;
  });
  
  // data nodes
  var resources = _.select(g, function(node, key) {
    if (node.type !== 'type') {
      var res = that.get('resources', key) || new uv.Resource(that, key, node);
      that.set('resources', key, res);
      that.get('types', node.type).set('resources', key, res);
      return true;
    }
    return false;
  });
  
  // Now that all resources are registered we can build them
  this.all('resources').each(function(index, r) {
    r.build();
  });
  
};

uv.DataGraph.prototype = Object.extend(uv.Node);
