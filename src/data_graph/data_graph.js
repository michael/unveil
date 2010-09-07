uv.DataGraph = function(g) {
  uv.Node.call(this);
  var that = this;
  
  // schema nodes
  var types = uv.select(g, function(node, key) {
    if (node.type === 'type') {
      that.set('types', key, new uv.Type(this, key, node));
      return true;
    }
    return false;
  });
  
  // data nodes
  var resources = uv.select(g, function(node, key) {
    if (node.type !== 'type') {
      var res = that.get('resources', key) || new uv.Resource(that, key, node);
      
      that.set('resources', key, res);
      
      if (!that.get('types', node.type)) {
        throw "Type '"+node.type+"' not found for "+key+"...";
      }
      
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

uv.DataGraph.prototype = uv.inherit(uv.Node);


// Return a set of matching resources based on a conditions hash
// 
// Usage:
// $ var items = graph.find({
// $   type: '/type/document',
// $   category: 'Conference Paper'
// $ });

uv.DataGraph.prototype.find = function(conditions) {
  
  this.all('resources').select(function(key, res) {
    for(var k in conditions) {
      if (key === 'type') {
        if (conditions[k] !== res.type.key) return false;
      } else {
        if (conditions[k] !== res.get(k)) return false;
      }
    }
    return true;
  });
};
