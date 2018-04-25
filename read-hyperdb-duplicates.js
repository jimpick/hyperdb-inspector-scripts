var hyperdb = require('hyperdrive/node_modules/hyperdb')

var db = hyperdb('./db')
db.list('/shopping-list', (err, list) => {
  var keys = list.map(function (node) { return node[0].key })
  console.log('Keys length:', keys.length)
})

/*
var db = hyperdb('./db')
db.heads((err, heads) => {
  db.list('/shopping-list', (err, list) => {
    var keys = list.map(function (node) { return node[0].key })
    console.log('Keys length:', keys.length)
    keys.forEach(key => {
      console.log(key)
    })
  })
})
*/

