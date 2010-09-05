# Build script adpated from http://github.com/jashkenas/coffee-script/Cakefile
# ==============================================================================

fs            = require 'fs'
sys           = require 'sys'
CoffeeScript  = require 'coffee-script'
{helpers}     = require './lib/helpers'
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
  'src/data_graph/data_graph.js'
  'src/data_graph/type.js'
  'src/data_graph/resource.js'
  'src/scene/matrix.js'
  'src/scene/actor.js'
  'src/scene/traverser.js'
  'src/scene/behaviors.js'
  'src/scene/display.js'
  'src/scene/commands.js'
  'src/scene/scene.js'
  'src/scene/tween.js'
  'src/scene/actors/rect.js'
  'src/scene/actors/label.js'
  'src/scene/actors/circle.js'
  'src/scene/actors/path.js'
  'src/outro.js'
]


# Run a CoffeeScript through the node/coffee interpreter.
run = (args) ->
  proc =         spawn 'bin/coffee', args
  proc.stderr.on 'data', (buffer) -> puts buffer.toString()
  proc.on        'exit', (status) -> process.exit(1) if status != 0

# Log a message with a color.
log = (message, color, explanation) ->
  puts "#{color or ''}#{message}#{reset} #{explanation or ''}"

# Build from source
build = ->
  content = ''
  content += fs.readFileSync(file)+'\n' for file in files
  fs.writeFileSync('./unveil.js', content, encoding='utf8')

# Watch a source file for changes
watch = (file) ->
  fs.watchFile file, {persistent: true, interval: 300}, (curr, prev) ->
    return if curr.mtime.getTime() is prev.mtime.getTime()
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


task 'test', 'run the test suite', ->
  helpers.extend global, require 'assert'
  passedTests = failedTests = 0
  startTime   = new Date
  originalOk  = ok
  helpers.extend global, {
    ok: (args...) -> passedTests += 1; originalOk(args...)
    CoffeeScript: CoffeeScript
  }
  
  process.on 'exit', ->
    time = ((new Date - startTime) / 1000).toFixed(2)
    message = "passed #{passedTests} tests in #{time} seconds#{reset}"
    if failedTests
      log "failed #{failedTests} and #{message}", red
    else
      log message, green
  fs.readdir 'test', (err, files) ->
    files.forEach (file) ->
      return unless file.match(/\.coffee$/i)
      fileName = path.join 'test', file
      fs.readFile fileName, (err, code) ->
        try
          CoffeeScript.run code.toString(), {fileName}
        catch err
          failedTests += 1
          log "failed #{fileName}", red, '\n' + err.stack.toString()
