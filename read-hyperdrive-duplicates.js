var test = require('tape')
var hyperdrive = require('hyperdrive')

test('no duplicates', function (t) {
  var archive = hyperdrive('./db')
  archive.readdir('/shopping-list', (err, list) => {
    t.equal(list.length, new Set(list).size)
    t.end()
  })
})
