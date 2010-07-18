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
  // TODO: use a suitable object recycling approach
  // getRecyclableItems: function(key) {
  //   if (!this.scene.all('children')) {
  //     return new uv.SortedHash();
  //   }
  //   
  //   // remove the stack objects from the scene
  //   var items = this.scene.all('children').select(function(key, c) {
  //     if (c instanceof uv.Stacks.Item) {
  //       // console.log(c.recyclable);
  //       if (c.recyclable && !c.recycled && c.key === key) {
  //         return true;
  //       }
  //     }
  //     
  //     return false;
  //   });
  //   
  //   return items;
  // },
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
  },
  build: function() {
    var that = this;
    
    this.width = 900,
    this.height = 300;
    
    this.stackItems = new uv.SortedHash();
    
    // create scenegraph
    this.scene = new uv.Scene({
      width: this.width,
      height: this.height,
      fillStyle: '#fff'
    });
    
    // set up stuff based on the currently selected property
    this.prepareProperty();
    this.addStacks();
    
  },
  removeRemainingRecyclableItems: function() {
    // remove the stack objects from the scene
    var items = this.scene.all('children').select(function(key, c) {
      // flag existing stack items as ecyclable
      // TODO: this is rather hacky, find a more elegant way.
      if (c instanceof uv.Stacks.Item) {
        if (c.recyclable && !c.recycled) {
          return false;
        } else {
          c.recyclable = false;
          c.recycled = undefined;
        }
      }
      return true;
    });
    this.scene.replace('children', items);    
  },
  changeGroup: function(group) {
    // update stacks
    // console.log('changing group to'+group);
    this.measures = [group];
    this.prepareProperty();
        
    // remove the old objects from the scene
    var items = this.scene.all('children').select(function(key, c) {
      // flag existing stack items as ecyclable
      // TODO: this is rather hacky, find a more elegant way.
      if (c instanceof uv.Stacks.Item) {
        c.recyclable = true;
        c.recycled = false;
        return true;
      }
      return false;
    });
    
    this.scene.replace('children', items);
    this.addStacks();
    
    // remove remaining recyclable items.
    this.removeRemainingRecyclableItems();
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
    // console.log('doink'+row);
    
    var stackItem;
    
    // var recyclables = that.p('stacks').getRecyclableItems(key);
    var recyclables = [];
    
    // is there an existing item I can recycle and send to its new location?
    if(recyclables.length>0) {
      stackItem = recyclables.at(0);
      stackItem.p('fillStyle', function() { return this.active ? '#ccc' : that.p('fillStyle') });      
      stackItem.updateSize(itemSize-1);
      stackItem.updateX(itemSize*(index % that.p('cols'))+that.p('index')*that.p('width'));
      stackItem.updateY(row*itemSize);
      stackItem.recycled = true; // temporary, to be reset after addStacks
    } else {
      stackItem = new uv.Stacks.Item({
        x: Math.random()*400,
        y: Math.random()*600,
        size: 1,
        fillStyle: function() { return this.active ? '#ccc' : that.p('fillStyle') },
        interactive: true
      });
      stackItem.key = key; // remember the key
      stackItem.updateX(itemSize*(index % that.p('cols'))+that.p('index')*that.p('width'));
      stackItem.updateY(row*itemSize);
      stackItem.updateSize(itemSize-1);
    }
    
    that.p('scene').add(stackItem);
    
    index += 1;
  });
  
};

uv.Stacks.Stack.prototype.draw = function(ctx) {
  // TODO: implement
  // ctx.fillRect(0, 0, this.properties.width, this.properties.height);
  // ctx.fillStyle = this.prop('fillStyle');
  // ctx.fillRect(0, 0, this.properties.width, this.properties.height);
};

// uv.Stacks.Item - extends uv.Bar
// =============================================================================

uv.Stacks.Item = function(properties) {
  // super call

  uv.Bar.call(this);
    
  _.extend(this.properties, {
    size: 10
  }, properties);
  
  this.tx = new uv.Tween(this.properties, "x", uv.Tween.strongEaseInOut, this.properties.x, this.properties.x, 2);
  this.ty = new uv.Tween(this.properties, "y", uv.Tween.strongEaseInOut, this.properties.y, this.properties.y, 2);
  this.ts = new uv.Tween(this.properties, "size", uv.Tween.strongEaseInOut, this.properties.size, this.properties.size, 2);
  
  this.build();
};

uv.Stacks.Item.prototype = Object.extend(uv.Bar);

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
  ctx.fillStyle = this.prop('fillStyle');
  ctx.fillRect(0, 0, this.prop('size'), this.prop('size'));
};

uv.Stacks.Item.prototype.drawMask = function(ctx) {
  ctx.beginPath();
  
  ctx.moveTo(0, 0);
  ctx.lineTo(this.properties.size, 0);
  ctx.lineTo(this.properties.size, this.properties.size);
  ctx.lineTo(0, this.properties.size);
  ctx.lineTo(0, 0);
  ctx.closePath();
};


uv.Stacks.Item.prototype.build = function(ctx) {
  
};


// TODO: implement a suitable mechansim for object recycling
uv.Recycler = function() {
  
};


// Specification
//------------------------------------------------------------------------------

uv.Stacks.spec = {
  measures: [
    {
      types: ['number'],
      unique: false,
      cardinality: 1,
    }
  ]
};
