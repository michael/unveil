fs            = require 'fs'
sys           = require 'sys'
{spawn, exec} = require 'child_process'

# ANSI terminal colors.
red   = '\033[0;31m'
green = '\033[0;32m'
reset = '\033[0m'

# Commands
compressionCmd = 'java -jar ./lib/compiler.jar --js unveil.js --js_output_file unveil.min.js'

# Unveil.js source files
files = [
  'src/intro.js'
  'src/uv.js'
  'src/sorted_hash/sorted_hash.js'
  'src/sorted_hash/aggregators.js'
  'src/sorted_hash/comparators.js'
  'src/node/node.js'
  'src/collection/value.js'
  'src/collection/item.js'
  'src/collection/property.js'
  'src/collection/collection.js'
  'src/collection/criterion.js'
  'src/collection/transformers/group.js'
  'src/collection/transformers/co_occurrences.js'
  'src/collection/transformers/co_occurrences_baccigalupo.js'
  'src/scene/vector.js'
  'src/scene/matrix2d.js'
  'src/scene/actor.js'
  'src/scene/behaviors.js'
  'src/scene/display.js'
  'src/scene/commands.js'
  'src/scene/scene.js'
  'src/scene/tween.js'
  'src/scene/actors/bar.js'
  'src/scene/actors/label.js'
  'src/scene/actors/dot.js'
  'src/visualization/visualization.js'
  'src/outro.js'
]


# Run a CoffeeScript through the node/coffee interpreter.
run = (args) ->
  proc =         spawn 'bin/coffee', args
  proc.stderr.on 'data', (buffer) -> puts buffer.toString()
  proc.on        'exit', (status) -> process.exit(1) if status != 0

# Log a message with a color.
log = (message, color, explanation) ->
  puts "#{color or ''}#message#reset #{explanation or ''}"

# Build from source
build = ->
  content = ''
  content += fs.readFileSync(file)+'\n' for file in files
  fs.writeFileSync('./unveil.js', content, encoding='utf8')

# Watch a source file for changes
watch = (file) ->
  fs.watchFile file, (curr, prev) ->
    if "#{curr.mtime}" != "#{prev.mtime}"
      build()
      log "Sucessfully rebuilt ./unveil.js at #{curr.mtime}", green  


task 'build:continuously', 'Build continuously (during development)', ->
  watch(file) for file in files


task 'build', 'Rebuild from source', ->    
  build()
  log 'Sucessfully built ./unveil.js', green


task 'build:full', 'Rebuild and create a compressed version', ->
  build()
  exec compressionCmd, (err, stdout, stderr) ->
    throw err if err
    log 'Sucessfully built ./unveil.js and ./unveil.min.js', green

task 'test', 'Run the testsuite', ->
  log 'TODO: implement', red