require '../unveil'
require '../lib/underscore'
fs      = require 'fs'
sys     = require 'sys'

# Build Scene
# ------------------------------------------------------------------------------

scene = new uv.Scene({})

# Create instances of actors
bar1 = new uv.Bar({
  x: 50
  y: 280
  width: 30
  height: 30
  fillStyle: 'orange'
  interactive: true
})

bar11 = new uv.Bar({})
bar12 = new uv.Bar({})
bar11 = new uv.Bar({})
bar111 = new uv.Bar({})

bar11.add(bar111)
bar1.add(bar11)
bar1.add(bar12)

bar2 = new uv.Bar({})
bar21 = new uv.Bar({})
bar211 = new uv.Bar({})

bar21.add(bar211)
bar2.add(bar21)

scene.add(bar1)
scene.add(bar2)


# Traverser
# ------------------------------------------------------------------------------

nodes = scene.traverse();

# DepthFirst is the defalt traverser
ok nodes[0] == scene
ok nodes[1] == bar2
ok nodes[2] == bar21
ok nodes[3] == bar211
ok nodes[4] == bar1
ok nodes[5] == bar12
ok nodes[6] == bar11
ok nodes[7] == bar111

# Use BreadthFirst traversal
scene.p('traverser', uv.traverser.BreadthFirst);
nodes = scene.traverse();

# Expected order
ok nodes[0] == scene
ok nodes[1] == bar1
ok nodes[2] == bar2
ok nodes[3] == bar11
ok nodes[4] == bar12
ok nodes[5] == bar21
ok nodes[6] == bar111
ok nodes[7] == bar211