require '../unveil'
require '../lib/underscore'
fs      = require 'fs'
sys     = require 'sys'

# Prepare fixture
documents = JSON.parse(fs.readFileSync('./fixtures/documents.json'))

# Invoke a DataGraph
# ------------------------------------------------------------------------------

graph = new uv.DataGraph(documents)

ok graph != undefined
ok graph.all('types').length == 3

ok graph.get('types', '/dc/document') instanceof uv.Type
ok graph.get('types', '/dc/entity') instanceof uv.Type
ok graph.get('types', '/dc/mention') instanceof uv.Type

# Type inspection
# ------------------------------------------------------------------------------

document_type = graph.get('types', '/dc/document')
ok document_type.all('properties').length == 4
ok document_type.key == '/dc/document'
ok document_type.name == 'Document'


# Property inspection
# ------------------------------------------------------------------------------

entities_property = document_type.get('properties', 'entities')
ok entities_property.name == 'Associated Entities'
ok entities_property.expected_type == '/dc/entity'


# Resource inspection
# ------------------------------------------------------------------------------

protovis = graph.get('resources', '/doc/protovis_introduction')
unveil = graph.get('resources', '/doc/unveil_introduction')
processingjs = graph.get('resources', '/doc/processing_js_introduction')
mention = graph.get('resources', 'M0000003')
anotherMention = graph.get('resources', 'M0000003')

ok protovis instanceof uv.Resource
ok mention instanceof uv.Resource
ok anotherMention instanceof uv.Resource

# There are four different access scenarios:
# For convenience there's a get method, which always returns the right result depending on the
# schema information. However, internally, every property of a resource is represented as a
# non-unique SortedHash of Node objects, even if it's a unique property. So if
# you want to be explicit you should use the native methods of the Node API.

# 1. Unique value types (one value)
# ..............................................................................

ok protovis.get('page_count') == 8
ok protovis.get('title') == 'Protovis'

# internally delegates to
ok protovis.get('page_count') == 8

# 2. Non-unique value types (many values)
# ..............................................................................

ok protovis.get('authors').length == 2
ok protovis.get('authors').at(0) == 'Michael Bostock'
ok protovis.get('authors').at(1) == 'Jeffrey Heer'

# internally delegates to
ok protovis.values('authors').length == 2

# 3. Unique object types (one resource)
# ..............................................................................

ok mention.get('entity').key == '/location/new_york'

# internally delegates to
ok mention.first('entity').key == '/location/new_york'

# 4. Non-unique object types
# ..............................................................................

ok protovis.get('entities').length == 2
ok protovis.get('entities').at(0).key == '/location/stanford'
ok protovis.get('entities').at(1).key == '/location/new_york'

# internally delgates to
ok protovis.all('entities').length == 2


# References to the same resource should result in object equality.
ok mention.first('entity') == anotherMention.first('entity')


# Navigating around
# ------------------------------------------------------------------------------

# Hop from a document to the second entity, picking the 2nd mention and go
# to the associated document of this mention.

protovis.get('entities').at(1) # => Entity#/location/new_york
        .get('mentions').at(1) # => Mention#M0000003
        .get('document') # => /doc/processing_js_introduction
        .key == '/doc/processing_js_introduction'


# Querying information
# ------------------------------------------------------------------------------

cities = graph.all('resources').select (key, res) ->
  /or/.test(res.get('name'))

ok cities.length == 3
ok cities.get('/location/new_york')
ok cities.get('/location/toronto')
ok cities.get('/location/stanford')


# Value identity
# ------------------------------------------------------------------------------

# If the values of a property are shared among resources they should have
# the same identity as well.

ok unveil.all('authors').at(0) == processingjs.all('authors').at(2)
ok unveil.get('authors').at(0) == 'Michael Aufreiter'
ok processingjs.get('authors').at(2) == 'Michael Aufreiter'

# This allows questions like:
# Show me all unique values of a certain property e.g. /dc/document.authors

ok protovis.type.get('properties', 'authors').all('values').length == 6
