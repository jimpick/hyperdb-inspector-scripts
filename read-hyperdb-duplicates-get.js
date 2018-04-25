var hyperdb = require('hyperdb')
var hash = require('hyperdb/lib/hash')

var db = hyperdb('./db')
var path = hash('/shopping-list', false)
db.get('', {path, prefix: true, map: false, reduce: false}, (err, nodes) => {
  console.log(err, nodes)
})
