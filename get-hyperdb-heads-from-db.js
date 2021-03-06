const hyperdb = require('hyperdrive/node_modules/hyperdb')

const db = hyperdb('./db')

db.heads((err, heads) => {
  if (err) throw err
  console.log('Heads', heads)
  console.log('Writers')
  db._writers.forEach((writer, index) => {
    console.log(index, writer._feed.key.toString('hex'), writer._feed.length)
  })
  console.log('ContentFeeds')
  console.log(db.contentFeeds)
})

