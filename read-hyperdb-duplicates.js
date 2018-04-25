var test = require('tape')
var hyperdb = require('hyperdrive/node_modules/hyperdb')

test('no duplicates', function (t) {
  var db = hyperdb('./db')
  db.list('/shopping-list', (err, list) => {
    t.error(err)
    var keys = list.map(function (node) { console.log(node[0].key); return node[0].key })
    t.equal(keys.length, new Set(keys).size)
    t.end()
  })
})
