// Stacks
// =============================================================================

uv.Stacks = uv.Visualization.extend({
  constructor: function(collection, options) {
    uv.Visualization.call(this, collection, options);
    this.margin = {top: 30, right: 40, bottom: 30, left: 150};
    this.build();
    
  },
  // Simple stack layout algorithm
  // Computes a suitable column count to fit the stacks
  // dimensions (width x height)
  computeCols: function(n, width, height) {
    var cols = 1, // number of cols
        a, // edge length
        rows; // number of rows
    
    while(true) {
      a = width / cols;
      rows = Math.ceil(n/cols);
      if (rows*a <= height && n*a*a <= width*height)
        return cols;
      else {
        cols += 1;
      }
    }
  },
  prepareProperty: function() {
    // register stacks based on property values (=groups)
    this.property = this.collection.get('properties', this.measures[0]);
    this.propertyValues = this.property.all('values');
    this.stackWidth = parseInt(this.width / this.property.all('values').length, 10);
    this.stackColors = pv.Scale.ordinal(this.propertyValues.values())
                 .range('#8DB5C8', '#808E89', '#B16649', '#90963C', '#A2C355', '#93BAA1', '#86A2A9');
    
    var max = 0; // maximum of items to be displayed in one stack
    this.propertyValues.each(function(index, value) {
      max = Math.max(max, value.all('items').length);
    });
    
    this.cols = this.computeCols(max, this.stackWidth, this.height);
  },
  addStacks: function() {
    var that = this;
    this.propertyValues.each(function(index, value) {
      that.scene.add(new uv.Stacks.Stack({
        items: value.all('items'),
        scene: that.scene, // direct scene access for the Stack
        stacks: that, // direct access to the Stacks object for the Stack
        x: index*that.stackWidth,
        cols: that.cols,
        index: index,
        width: that.stackWidth,
        height: that.height,
        fillStyle: that.stackColors(value.val).color,
        name: value.val
      }));
    });
    
    this.scene.add(new uv.Label({
      x: that.width,
      y: 20,
      font: '12px Helvetica Neue, Helvetica, Arial',
      text: function() { return "FPS: "+parseInt(that.scene.framerate); },
      textAlign: 'right',
      fillStyle: 'black'
    }));
  },
  build: function() {
    var that = this;
    
    this.width = this.$canvas.width()-10,
    this.height = this.$canvas.height()-10;
    
    this.stackItems = new uv.SortedHash();
    
    // create scenegraph
    this.scene = new uv.Scene({
      traverser: uv.traverser.BreadthFirst,
      fillStyle: '#fff',
      framerate: 10,
      displays: [{
        container: $('#canvas'),
        width: this.width,
        height: this.height,
        paning: true,
        zooming: true
      }]
    });
    
    this.scene.register(uv.cmds.RequestFramerate, {framerate: 60});    
    
    // set up stuff based on the currently selected property
    this.prepareProperty();
    this.addStacks();
  },
  zoom: function(zoomLevel) {
    this.scene.scale(zoomLevel, zoomLevel);
  },
  changeGroup: function(group) {
    // update stacks
    this.measures = [group];
    this.prepareProperty();

    this.scene.replace('children', new uv.SortedHash());
    this.scene.interactiveActors = [];
    this.addStacks();
  },
  render: function() {
    this.scene.start();
  }
});


// Stacks.Stack
// =============================================================================

uv.Stacks.Stack = function(properties) {
  // super call
  uv.Actor.call(this);
    
  _.extend(this.properties, {
    width: 30,
    height: 50,
    strokeStyle: '#000',
    fillStyle: '#aaa'
  }, properties);
  
  this.build();
};

uv.Stacks.Stack.prototype = Object.extend(uv.Actor);

uv.Stacks.Stack.prototype.build = function(ctx) {
  var that = this;
  
  var itemSize = parseInt(this.p('width') / this.p('cols'), 10);
  var index = 0;
  this.p('items').eachKey(function(key, item) {
    var row = parseInt(index / that.p('cols'), 10);
    
    var stackItem;
    stackItem = new uv.Stacks.Item({
      x: Math.random()*400,
      y: Math.random()*600,
      size: 1,
      fillStyle: function() { return this.active ? '#ccc' : that.p('fillStyle') },
      interactive: true,
      item: item
    });
    
    stackItem.key = key; // remember the key
    stackItem.p('scene', that.p('scene'));
    stackItem.updateX(itemSize*(index % that.p('cols'))+that.p('index')*that.p('width'));
    stackItem.updateY(that.p('height')-100-row*itemSize);
    stackItem.updateSize(itemSize-1);
    
    that.p('scene').add(stackItem);
    
    index += 1;
  });
  
  this.add(new uv.Label({
    x: that.p('width')/2,
    y: that.p('height')-20,
    font: '11px Helvetica Neue, Helvetica, Arial',
    // rotation: uv.PI/2+uv.PI,
    text: function() { return that.p('name'); },
    textAlign: 'center',
    fillStyle: '#333'
  }));
};

uv.Stacks.Stack.prototype.draw = function(ctx) {
  // TODO: implement
  // ctx.fillRect(0, 0, this.properties.width, this.properties.height);
  // ctx.fillStyle = this.p('fillStyle');
  // ctx.fillRect(0, 0, this.properties.width, this.properties.height);
};

// uv.Stacks.Item - extends uv.Bar
// =============================================================================

uv.Stacks.Item = function(properties) {
  // super call
  var that = this;
  uv.Bar.call(this);
    
  _.extend(this.properties, {
    size: 10,
    name: 'Unknown',
    bounds: function() {
      return [
        {x: 0, y: 0},
        {x: this.p('size'), y: 0},
        {x: this.p('size'), y: this.p('size')},
        {x: 0, y: this.p('size')}
      ];
    }
  }, properties);
  
  this.ts = new uv.Tween({
    obj: this.properties,
    property: 'size',
    duration: 2
  });
  
  this.tx = new uv.Tween({
    obj: this.properties,
    property: 'x',
    duration: 2
  });
  
  this.ty = new uv.Tween({
    obj: this.properties,
    property: 'y',
    duration: 2
  });
  
  // request and release high framerate on demand
  this.ts.on('start', function() { that.p('scene').execute(uv.cmds.RequestFramerate); });
  this.ts.on('finish', function() { that.p('scene').unexecute(uv.cmds.RequestFramerate); });

  this.build();
};

uv.Stacks.Item.prototype = Object.extend(uv.Bar);

uv.Stacks.Item.prototype.build = function(ctx) {
  var that = this;
  
  
  var bar = new uv.Bar({
    x: 0,
    y: 0,
    width: 200,
    height: 50,
    fillStyle: 'rgba(200,200,200,0.8)',
    visible: function() { return that.active ? true : false; }
  });
  
  bar.add(new uv.Label({
    x: 10,
    y: 20,
    font: 'bold 15px Helvetica Neue, Helvetica, Arial',
    text: function() { return that.p('item').identify(); },
    textAlign: 'left',
    fillStyle: '#333'
  }));
  
  this.add(bar);

};

uv.Stacks.Item.prototype.updateX = function(tx) {
  this.tx.continueTo(tx, 1.5);
};

uv.Stacks.Item.prototype.updateY = function(ty) {
  this.ty.continueTo(ty, 1.5);
};

uv.Stacks.Item.prototype.updateSize = function(size) {
  this.ts.continueTo(size, 1.5);
};

// trigger motion tween ticks
uv.Stacks.Item.prototype.update = function() {
  this.tx.tick();
  this.ty.tick();
  this.ts.tick();
};

uv.Stacks.Item.prototype.draw = function(ctx) {
  ctx.fillStyle = this.p('fillStyle');
  ctx.fillRect(0, 0, this.p('size'), this.p('size'));
};

// Specification
//------------------------------------------------------------------------------

uv.Stacks.spec = {
  measures: [
    {
      types: ['number'],
      unique: false,
      cardinality: 1
    }
  ]
};
